import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import BackdropLoading from "../../components/BackdropLoading";
import ConfirmationModal from "../../components/ConfirmationModal";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "auto",
    ...theme.scrollbarStyles
  }
}));

const defaultForm = {
  name: "",
  whatsappId: "",
  message: "",
  scheduledAt: "",
  contactIds: []
};

const Campaigns = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [whatsapps, setWhatsapps] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");
  const [availableLimit, setAvailableLimit] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (user && user.profile !== "admin") {
      toast.error(i18n.t("backendErrors.ERR_NO_PERMISSION"));
      history.replace("/");
      return;
    }

    const loadData = async () => {
      try {
        const [{ data: campaignsData }, { data: whatsappsData }] = await Promise.all([
          api.get("/campaigns"),
          api.get("/whatsapp/")
        ]);

        setCampaigns(campaignsData);
        setWhatsapps(whatsappsData);
      } catch (error) {
        toastError(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [history, user]);

  useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/contacts/", {
          params: {
            searchParam: contactSearch,
            pageNumber: 1
          }
        });

        setContacts(data.contacts || []);
      } catch (error) {
        toastError(error);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [contactSearch, dialogOpen]);

  useEffect(() => {
    if (!form.whatsappId) {
      setAvailableLimit(null);
      return;
    }

    const loadLimit = async () => {
      try {
        const { data } = await api.get("/campaigns/limits", {
          params: {
            whatsappId: form.whatsappId
          }
        });
        setAvailableLimit(data.remaining);
      } catch (error) {
        toastError(error);
      }
    };

    loadLimit();
  }, [form.whatsappId]);

  const handleOpenDialog = () => {
    setForm(defaultForm);
    setSelectedFile(null);
    setDialogOpen(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("whatsappId", form.whatsappId);
      formData.append("message", form.message);
      formData.append("contactIds", JSON.stringify(form.contactIds));

      if (form.scheduledAt) {
        formData.append("scheduledAt", new Date(form.scheduledAt).toISOString());
      }

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await api.post("/campaigns", formData);
      const { data } = await api.get("/campaigns");
      setCampaigns(data);
      setDialogOpen(false);
      toast.success(i18n.t("campaigns.success"));
    } catch (error) {
      toastError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelCampaign = async () => {
    try {
      await api.delete(`/campaigns/${selectedCampaign.id}`);
      const { data } = await api.get("/campaigns");
      setCampaigns(data);
      setConfirmOpen(false);
      setSelectedCampaign(null);
      toast.success(i18n.t("campaigns.canceled"));
    } catch (error) {
      toastError(error);
    }
  };

  const getCounts = campaign => {
    const total = campaign.contacts?.length || 0;
    const sent = (campaign.contacts || []).filter(contact => contact.status === "sent").length;
    const failed = (campaign.contacts || []).filter(contact => contact.status === "failed").length;

    return { total, sent, failed };
  };

  const selectedContacts = useMemo(
    () => contacts.filter(contact => form.contactIds.includes(contact.id)),
    [contacts, form.contactIds]
  );

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <MainContainer>
      <ConfirmationModal
        title={i18n.t("campaigns.cancelTitle")}
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={handleCancelCampaign}
      >
        {i18n.t("campaigns.cancelMessage")}
      </ConfirmationModal>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{i18n.t("campaigns.newCampaign")}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("campaigns.fields.name")}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                variant="outlined"
                label={i18n.t("campaigns.fields.whatsapp")}
                name="whatsappId"
                value={form.whatsappId}
                onChange={handleChange}
              >
                {whatsapps.map(whatsapp => (
                  <MenuItem key={whatsapp.id} value={whatsapp.id}>
                    {whatsapp.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label={i18n.t("campaigns.fields.message")}
                name="message"
                value={form.message}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                label={i18n.t("campaigns.fields.scheduledAt")}
                name="scheduledAt"
                value={form.scheduledAt}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                type="file"
                InputLabelProps={{ shrink: true }}
                label={i18n.t("campaigns.fields.file")}
                onChange={event => setSelectedFile(event.target.files[0] || null)}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={contacts}
                getOptionLabel={option => `${option.name} (${option.number})`}
                value={selectedContacts}
                onInputChange={(event, value) => setContactSearch(value)}
                onChange={(event, value) => {
                  setForm(prevState => ({
                    ...prevState,
                    contactIds: value.map(contact => contact.id)
                  }));
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={i18n.t("campaigns.fields.contacts")}
                    placeholder={i18n.t("campaigns.fields.contactsPlaceholder")}
                  />
                )}
              />
            </Grid>
            {availableLimit !== null ? (
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  {i18n.t("campaigns.limitInfo", { count: availableLimit })}
                </Typography>
              </Grid>
            ) : null}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary" variant="outlined">
            {i18n.t("campaigns.cancel")}
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" disabled={saving}>
            {saving ? i18n.t("campaigns.saving") : i18n.t("campaigns.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <MainHeader>
        <Title>{i18n.t("campaigns.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            {i18n.t("campaigns.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{i18n.t("campaigns.table.name")}</TableCell>
              <TableCell>{i18n.t("campaigns.table.whatsapp")}</TableCell>
              <TableCell>{i18n.t("campaigns.table.status")}</TableCell>
              <TableCell>{i18n.t("campaigns.table.scheduledAt")}</TableCell>
              <TableCell>{i18n.t("campaigns.table.results")}</TableCell>
              <TableCell>{i18n.t("campaigns.table.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map(campaign => {
              const counts = getCounts(campaign);
              return (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.whatsapp?.name}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    {campaign.scheduledAt
                      ? new Date(campaign.scheduledAt).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {counts.sent}/{counts.total}
                    {counts.failed ? ` (${counts.failed} ${i18n.t("campaigns.failed")})` : ""}
                  </TableCell>
                  <TableCell>
                    {["scheduled", "processing"].includes(campaign.status) ? (
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setConfirmOpen(true);
                        }}
                      >
                        <DeleteOutline />
                      </IconButton>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

export default Campaigns;
