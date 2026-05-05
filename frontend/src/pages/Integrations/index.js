import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import BackdropLoading from "../../components/BackdropLoading";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    overflowY: "auto",
    ...theme.scrollbarStyles
  },
  sectionPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

const defaultSettings = {
  n8nActive: false,
  n8nBaseUrl: "",
  n8nWebhookUrl: "",
  n8nSecret: "",
  chatgptActive: false,
  chatgptApiKey: "",
  chatgptModel: "gpt-4.1-mini",
  chatgptBasePrompt: "",
  chatgptTemperature: 0.7,
  chatgptMaxTokens: 500,
  chatgptQueueIds: [],
  evolutionActive: false,
  evolutionBaseUrl: "",
  evolutionApiKey: "",
  evolutionDefaultInstance: "",
  evolutionUseAsDefault: false
};

const Integrations = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEvolution, setTestingEvolution] = useState(false);
  const [queues, setQueues] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (user && user.profile !== "admin") {
      toast.error(i18n.t("backendErrors.ERR_NO_PERMISSION"));
      history.replace("/");
      return;
    }

    const loadData = async () => {
      try {
        const [{ data: settingsData }, { data: queuesData }] = await Promise.all([
          api.get("/integrations"),
          api.get("/queue")
        ]);

        setSettings(prevState => ({
          ...prevState,
          ...settingsData
        }));
        setQueues(queuesData);
      } catch (error) {
        toastError(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [history, user]);

  const handleChange = event => {
    const { name, value } = event.target;
    setSettings(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSwitchChange = event => {
    const { name, checked } = event.target;
    setSettings(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put("/integrations", settings);
      toast.success(i18n.t("integrations.success"));
    } catch (error) {
      toastError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleTestEvolution = async () => {
    try {
      setTestingEvolution(true);
      await api.post("/evolution/test", {
        baseUrl: settings.evolutionBaseUrl,
        apiKey: settings.evolutionApiKey
      });
      toast.success(i18n.t("integrations.evolution.testSuccess"));
    } catch (error) {
      toastError(error);
    } finally {
      setTestingEvolution(false);
    }
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t("integrations.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? i18n.t("integrations.saving") : i18n.t("integrations.save")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Paper className={classes.mainPaper} variant="outlined">
        <Paper className={classes.sectionPaper} variant="outlined">
          <Typography variant="h6">{i18n.t("integrations.n8n.title")}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={settings.n8nActive}
                    onChange={handleSwitchChange}
                    name="n8nActive"
                  />
                }
                label={i18n.t("integrations.n8n.active")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.n8n.baseUrl")}
                name="n8nBaseUrl"
                value={settings.n8nBaseUrl}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.n8n.webhookUrl")}
                name="n8nWebhookUrl"
                value={settings.n8nWebhookUrl}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.n8n.secret")}
                name="n8nSecret"
                value={settings.n8nSecret}
                onChange={handleChange}
                helperText={i18n.t("integrations.keepSecretHint")}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.sectionPaper} variant="outlined">
          <Typography variant="h6">{i18n.t("integrations.chatgpt.title")}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={settings.chatgptActive}
                    onChange={handleSwitchChange}
                    name="chatgptActive"
                  />
                }
                label={i18n.t("integrations.chatgpt.active")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.chatgpt.apiKey")}
                name="chatgptApiKey"
                value={settings.chatgptApiKey}
                onChange={handleChange}
                helperText={i18n.t("integrations.keepSecretHint")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.chatgpt.model")}
                name="chatgptModel"
                value={settings.chatgptModel}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.chatgpt.temperature")}
                name="chatgptTemperature"
                type="number"
                value={settings.chatgptTemperature}
                onChange={handleChange}
                inputProps={{ min: 0, max: 2, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.chatgpt.maxTokens")}
                name="chatgptMaxTokens"
                type="number"
                value={settings.chatgptMaxTokens}
                onChange={handleChange}
                inputProps={{ min: 100, max: 4000 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label={i18n.t("integrations.chatgpt.basePrompt")}
                name="chatgptBasePrompt"
                value={settings.chatgptBasePrompt}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>{i18n.t("integrations.chatgpt.queues")}</InputLabel>
                <Select
                  multiple
                  value={settings.chatgptQueueIds}
                  onChange={handleChange}
                  name="chatgptQueueIds"
                  label={i18n.t("integrations.chatgpt.queues")}
                  renderValue={selected =>
                    queues
                      .filter(queue => selected.includes(queue.id))
                      .map(queue => queue.name)
                      .join(", ")
                  }
                >
                  {queues.map(queue => (
                    <MenuItem key={queue.id} value={queue.id}>
                      {queue.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper className={classes.sectionPaper} variant="outlined">
          <Typography variant="h6">
            {i18n.t("integrations.evolution.title")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={settings.evolutionActive}
                    onChange={handleSwitchChange}
                    name="evolutionActive"
                  />
                }
                label={i18n.t("integrations.evolution.active")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.evolution.baseUrl")}
                name="evolutionBaseUrl"
                value={settings.evolutionBaseUrl}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.evolution.instance")}
                name="evolutionDefaultInstance"
                value={settings.evolutionDefaultInstance}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("integrations.evolution.apiKey")}
                name="evolutionApiKey"
                value={settings.evolutionApiKey}
                onChange={handleChange}
                helperText={i18n.t("integrations.keepSecretHint")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={settings.evolutionUseAsDefault}
                    onChange={handleSwitchChange}
                    name="evolutionUseAsDefault"
                  />
                }
                label={i18n.t("integrations.evolution.useAsDefault")}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleTestEvolution}
                disabled={testingEvolution}
              >
                {testingEvolution
                  ? i18n.t("integrations.evolution.testing")
                  : i18n.t("integrations.evolution.test")}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
    </MainContainer>
  );
};

export default Integrations;
