import { getIO } from "../../libs/socket";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import { logger } from "../../utils/logger";
import EmitIntegrationEventService from "../IntegrationServices/EmitIntegrationEventService";

interface ExtraInfo {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  lid?: string;
  isGroup: boolean;
  email?: string;
  profilePicUrl?: string;
  extraInfo?: ExtraInfo[];
  skipSocketEmit?: boolean;
}

const emitContact = (action: "update" | "create", contact: Contact) => {
  const io = getIO();

  io.emit("contact", { action, contact });
};

const CreateOrUpdateContactService = async ({
  name,
  number: rawNumber,
  lid,
  profilePicUrl,
  isGroup,
  email = "",
  extraInfo = [],
  skipSocketEmit = false
}: Request): Promise<Contact> => {
  const number = isGroup ? rawNumber : rawNumber.replace(/[^0-9]/g, "");
  if (!number && !lid) throw new Error("Either number or lid must be provided");

  const [contactByNumber, contactByLid] = await Promise.all([
    number ? Contact.findOne({ where: { number } }) : null,
    lid ? Contact.findOne({ where: { lid } }) : null
  ]);

  const shouldMerge =
    contactByNumber && contactByLid && contactByNumber.id !== contactByLid.id;

  if (shouldMerge) {
    await Ticket.update(
      { contactId: contactByNumber.id },
      { where: { contactId: contactByLid.id } }
    );

    await contactByLid.destroy();

    await contactByNumber.update({
      lid: contactByLid.lid,
      profilePicUrl
    });

    logger.info({
      info: "Merged contacts by number and lid",
      primaryContactId: contactByNumber.id,
      mergedContactId: contactByLid.id
    });

    if (!skipSocketEmit) {
      emitContact("update", contactByNumber);
    }

    return contactByNumber;
  }

  if (contactByNumber) {
    await contactByNumber.update({
      lid: lid || contactByNumber.lid,
      profilePicUrl
    });

    if (!skipSocketEmit) {
      emitContact("update", contactByNumber);
    }

    return contactByNumber;
  }

  if (contactByLid) {
    await contactByLid.update({
      number: number || contactByLid.number,
      profilePicUrl
    });

    if (!skipSocketEmit) {
      emitContact("update", contactByLid);
    }
    return contactByLid;
  }

  const created = await Contact.create({
    name,
    number,
    lid,
    profilePicUrl,
    email,
    isGroup,
    extraInfo
  });

  if (!skipSocketEmit) {
    emitContact("create", created);
  }

  EmitIntegrationEventService({
    event: "contact_created",
    payload: {
      id: created.id,
      name: created.name,
      number: created.number,
      lid: created.lid,
      isGroup: created.isGroup
    }
  });

  return created;
};

export default CreateOrUpdateContactService;
