import React, { useContext, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import { DeleteOutline, Edit, Visibility } from "@material-ui/icons";
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

const webhookEvents = [
  "ticket_created",
  "ticket_updated",
  "ticket_closed",
  "message_received",
  "message_sent",
  "contact_created",
  "whatsapp_connected",
  "whatsapp_disconnected",
  "campaign_sent"
];

const defaultForm = {
  id: null,
  name: "",
  url: "",
  secret: "",
  events: [],
  isActive: true
};

const Webhooks = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (user && user.profile !== "admin") {
      toast.error(i18n.t("backendErrors.ERR_NO_PERMISSION"));
      history.replace("/");
      return;
    }

    const loadData = async () => {
      try {
        const { data } = await api.get("/webhooks");
        setItems(data);
      } catch (error) {
        toastError(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [history, user]);

  const eventLabelMap = useMemo(
    () =>
      webhookEvents.reduce((accumulator, eventName) => {
        accumulator[eventName] = i18n.t(`webhooks.events.${eventName}`);
        return accumulator;
      }, {}),
    []
  );

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSwitchChange = event => {
    const { name, checked } = event.target;
    setForm(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleOpenDialog = webhook => {
    if (webhook) {
      setForm({
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        secret: webhook.secret || "",
        events: typeof webhook.events === "string" ? JSON.parse(webhook.events) : [],
        isActive: webhook.isActive
      });
      setSelected(webhook);
    } else {
      setForm(defaultForm);
      setSelected(null);
    }

    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (form.id) {
        await api.put(`/webhooks/${form.id}`, form);
      } else {
        await api.post("/webhooks", form);
      }

      const { data } = await api.get("/webhooks");
      setItems(data);
      setDialogOpen(false);
      setForm(defaultForm);
      toast.success(i18n.t("webhooks.success"));
    } catch (error) {
      toastError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/webhooks/${selected.id}`);
      setItems(prevState => prevState.filter(item => item.id !== selected.id));
      setConfirmOpen(false);
      setSelected(null);
      toast.success(i18n.t("webhooks.deleted"));
    } catch (error) {
      toastError(error);
    }
  };

  const handleTest = async webhookId => {
    try {
      await api.post(`/webhooks/${webhookId}/test`);
      toast.success(i18n.t("webhooks.testSuccess"));
    } catch (error) {
      toastError(error);
    }
  };

  const handleOpenLogs = async webhook => {
    try {
      const { data } = await api.get(`/webhooks/${webhook.id}/logs`);
      setLogs(data);
      setSelected(webhook);
      setLogsOpen(true);
    } catch (error) {
      toastError(error);
    }
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <MainContainer>
      <ConfirmationModal
        title={i18n.t("webhooks.deleteConfirmTitle")}
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={handleDelete}
      >
        {i18n.t("webhooks.deleteConfirmMessage")}
      </ConfirmationModal>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{i18n.t("webhooks.dialogTitle")}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            fullWidth
            variant="outlined"
            label={i18n.t("webhooks.fields.name")}
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            fullWidth
            variant="outlined"
            label={i18n.t("webhooks.fields.url")}
            name="url"
            value={form.url}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            fullWidth
            variant="outlined"
            label={i18n.t("webhooks.fields.secret")}
            name="secret"
            value={form.secret}
            onChange={handleChange}
          />
          <FormControl margin="dense" variant="outlined" fullWidth>
            <InputLabel>{i18n.t("webhooks.fields.events")}</InputLabel>
            <Select
              multiple
              label={i18n.t("webhooks.fields.events")}
              name="events"
              value={form.events}
              onChange={handleChange}
              renderValue={selectedEvents =>
                selectedEvents.map(eventName => eventLabelMap[eventName] || eventName).join(", ")
              }
            >
              {webhookEvents.map(eventName => (
                <MenuItem key={eventName} value={eventName}>
                  <Checkbox checked={form.events.includes(eventName)} />
                  <ListItemText primary={eventLabelMap[eventName] || eventName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={form.isActive}
                onChange={handleSwitchChange}
                name="isActive"
              />
            }
            label={i18n.t("webhooks.fields.active")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary" variant="outlined">
            {i18n.t("webhooks.cancel")}
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {i18n.t("webhooks.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logsOpen} onClose={() => setLogsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{i18n.t("webhooks.logsTitle")}</DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{i18n.t("webhooks.logs.event")}</TableCell>
                <TableCell>{i18n.t("webhooks.logs.status")}</TableCell>
                <TableCell>{i18n.t("webhooks.logs.error")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.event}</TableCell>
                  <TableCell>{log.statusCode || "-"}</TableCell>
                  <TableCell>{log.error || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogsOpen(false)} color="primary" variant="outlined">
            {i18n.t("webhooks.close")}
          </Button>
        </DialogActions>
      </Dialog>

      <MainHeader>
        <Title>{i18n.t("webhooks.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
            {i18n.t("webhooks.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{i18n.t("webhooks.table.name")}</TableCell>
              <TableCell>{i18n.t("webhooks.table.url")}</TableCell>
              <TableCell>{i18n.t("webhooks.table.events")}</TableCell>
              <TableCell>{i18n.t("webhooks.table.status")}</TableCell>
              <TableCell>{i18n.t("webhooks.table.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => {
              const parsedEvents =
                typeof item.events === "string" ? JSON.parse(item.events) : item.events;

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.url}</TableCell>
                  <TableCell>
                    {parsedEvents.map(eventName => eventLabelMap[eventName] || eventName).join(", ")}
                  </TableCell>
                  <TableCell>{item.lastStatus || "-"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      onClick={() => handleTest(item.id)}
                    >
                      {i18n.t("webhooks.test")}
                    </Button>
                    <IconButton size="small" onClick={() => handleOpenLogs(item)}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelected(item);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteOutline />
                    </IconButton>
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

export default Webhooks;
