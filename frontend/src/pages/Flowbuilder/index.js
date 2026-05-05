import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
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
import { DeleteOutline, Edit } from "@material-ui/icons";
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
  },
  nodePaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

const createNode = () => ({
  clientId: `${Date.now()}-${Math.random()}`,
  label: "",
  nodeType: "send_message",
  body: "",
  conditionValue: "",
  queueId: "",
  url: "",
  nextNodeId: "",
  trueNextNodeId: "",
  falseNextNodeId: ""
});

const Flowbuilder = () => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [queues, setQueues] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    isActive: false,
    triggerKeyword: "",
    nodes: [createNode()]
  });

  useEffect(() => {
    if (user && user.profile !== "admin") {
      toast.error(i18n.t("backendErrors.ERR_NO_PERMISSION"));
      history.replace("/");
      return;
    }

    const loadData = async () => {
      try {
        const [{ data: flowsData }, { data: queuesData }] = await Promise.all([
          api.get("/flows"),
          api.get("/queue")
        ]);

        setItems(flowsData);
        setQueues(queuesData);
      } catch (error) {
        toastError(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [history, user]);

  const handleNodeChange = (index, field, value) => {
    setForm(prevState => {
      const nodes = [...prevState.nodes];
      nodes[index] = {
        ...nodes[index],
        [field]: value
      };

      return {
        ...prevState,
        nodes
      };
    });
  };

  const handleOpenDialog = flow => {
    if (!flow) {
      setForm({
        id: null,
        name: "",
        description: "",
        isActive: false,
        triggerKeyword: "",
        nodes: [createNode()]
      });
      setSelectedFlow(null);
      setDialogOpen(true);
      return;
    }

    const triggerConfig =
      typeof flow.triggerConfig === "string" ? JSON.parse(flow.triggerConfig || "{}") : {};
    const edges = flow.edges || [];
    const nodes = (flow.nodes || []).map(node => {
      const parsedConfig = node.config ? JSON.parse(node.config) : {};
      const outgoingEdges = edges.filter(edge => edge.sourceNodeId === node.id);

      return {
        clientId: String(node.id),
        label: node.label,
        nodeType: node.nodeType,
        body: parsedConfig.body || "",
        conditionValue: parsedConfig.value || "",
        queueId: parsedConfig.queueId || "",
        url: parsedConfig.url || "",
        nextNodeId:
          node.nodeType === "condition_contains" ? "" : String(outgoingEdges[0]?.targetNodeId || ""),
        trueNextNodeId:
          node.nodeType === "condition_contains"
            ? String(
                outgoingEdges.find(edge => edge.conditionValue === "true")?.targetNodeId || ""
              )
            : "",
        falseNextNodeId:
          node.nodeType === "condition_contains"
            ? String(
                outgoingEdges.find(edge => edge.conditionValue === "false")?.targetNodeId || ""
              )
            : ""
      };
    });

    setForm({
      id: flow.id,
      name: flow.name,
      description: flow.description || "",
      isActive: Boolean(flow.isActive),
      triggerKeyword: triggerConfig.keyword || "",
      nodes: nodes.length > 0 ? nodes : [createNode()]
    });
    setSelectedFlow(flow);
    setDialogOpen(true);
  };

  const buildPayload = () => {
    const nodes = form.nodes.map((node, index) => ({
      clientId: node.clientId,
      label: node.label || `${i18n.t("flowbuilder.step")} ${index + 1}`,
      nodeType: node.nodeType,
      positionX: index * 180,
      positionY: 0,
      config:
        node.nodeType === "send_message"
          ? { body: node.body }
          : node.nodeType === "condition_contains"
          ? { value: node.conditionValue }
          : node.nodeType === "transfer_queue"
          ? { queueId: node.queueId }
          : node.nodeType === "webhook"
          ? { url: node.url }
          : {}
    }));

    const edges = [];

    form.nodes.forEach(node => {
      if (node.nodeType === "condition_contains") {
        if (node.trueNextNodeId) {
          edges.push({
            sourceNodeId: node.clientId,
            targetNodeId: node.trueNextNodeId,
            conditionValue: "true"
          });
        }
        if (node.falseNextNodeId) {
          edges.push({
            sourceNodeId: node.clientId,
            targetNodeId: node.falseNextNodeId,
            conditionValue: "false"
          });
        }
        return;
      }

      if (node.nextNodeId) {
        edges.push({
          sourceNodeId: node.clientId,
          targetNodeId: node.nextNodeId
        });
      }
    });

    return {
      name: form.name,
      description: form.description,
      isActive: form.isActive,
      triggerType: "keyword",
      triggerConfig: {
        keyword: form.triggerKeyword,
        matchType: "contains"
      },
      nodes,
      edges
    };
  };

  const reloadFlows = async () => {
    const { data } = await api.get("/flows");
    setItems(data);
  };

  const handleSave = async () => {
    try {
      const payload = buildPayload();

      if (form.id) {
        await api.put(`/flows/${form.id}`, payload);
      } else {
        await api.post("/flows", payload);
      }

      await reloadFlows();
      setDialogOpen(false);
      toast.success(i18n.t("flowbuilder.success"));
    } catch (error) {
      toastError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/flows/${selectedFlow.id}`);
      await reloadFlows();
      setConfirmOpen(false);
      setSelectedFlow(null);
      toast.success(i18n.t("flowbuilder.deleted"));
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
        title={i18n.t("flowbuilder.deleteTitle")}
        open={confirmOpen}
        onClose={setConfirmOpen}
        onConfirm={handleDelete}
      >
        {i18n.t("flowbuilder.deleteMessage")}
      </ConfirmationModal>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{i18n.t("flowbuilder.dialogTitle")}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("flowbuilder.fields.name")}
                value={form.name}
                onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                label={i18n.t("flowbuilder.fields.keyword")}
                value={form.triggerKeyword}
                onChange={event =>
                  setForm(prev => ({ ...prev, triggerKeyword: event.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                label={i18n.t("flowbuilder.fields.description")}
                value={form.description}
                onChange={event =>
                  setForm(prev => ({ ...prev, description: event.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={form.isActive}
                    onChange={event =>
                      setForm(prev => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                }
                label={i18n.t("flowbuilder.fields.active")}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">{i18n.t("flowbuilder.nodesTitle")}</Typography>
            </Grid>
            <Grid item xs={12}>
              {form.nodes.map((node, index) => (
                <Paper key={node.clientId} className={classes.nodePaper} variant="outlined">
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label={i18n.t("flowbuilder.fields.nodeLabel")}
                        value={node.label}
                        onChange={event =>
                          handleNodeChange(index, "label", event.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        select
                        variant="outlined"
                        label={i18n.t("flowbuilder.fields.nodeType")}
                        value={node.nodeType}
                        onChange={event =>
                          handleNodeChange(index, "nodeType", event.target.value)
                        }
                      >
                        <MenuItem value="send_message">
                          {i18n.t("flowbuilder.nodeTypes.send_message")}
                        </MenuItem>
                        <MenuItem value="condition_contains">
                          {i18n.t("flowbuilder.nodeTypes.condition_contains")}
                        </MenuItem>
                        <MenuItem value="transfer_queue">
                          {i18n.t("flowbuilder.nodeTypes.transfer_queue")}
                        </MenuItem>
                        <MenuItem value="close_ticket">
                          {i18n.t("flowbuilder.nodeTypes.close_ticket")}
                        </MenuItem>
                        <MenuItem value="webhook">
                          {i18n.t("flowbuilder.nodeTypes.webhook")}
                        </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        color="secondary"
                        onClick={() =>
                          setForm(prev => ({
                            ...prev,
                            nodes: prev.nodes.filter((item, itemIndex) => itemIndex !== index)
                          }))
                        }
                      >
                        {i18n.t("flowbuilder.removeStep")}
                      </Button>
                    </Grid>

                    {node.nodeType === "send_message" ? (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          variant="outlined"
                          label={i18n.t("flowbuilder.fields.message")}
                          value={node.body}
                          onChange={event => handleNodeChange(index, "body", event.target.value)}
                        />
                      </Grid>
                    ) : null}

                    {node.nodeType === "condition_contains" ? (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={i18n.t("flowbuilder.fields.conditionValue")}
                          value={node.conditionValue}
                          onChange={event =>
                            handleNodeChange(index, "conditionValue", event.target.value)
                          }
                        />
                      </Grid>
                    ) : null}

                    {node.nodeType === "transfer_queue" ? (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          variant="outlined"
                          label={i18n.t("flowbuilder.fields.queue")}
                          value={node.queueId}
                          onChange={event => handleNodeChange(index, "queueId", event.target.value)}
                        >
                          {queues.map(queue => (
                            <MenuItem key={queue.id} value={queue.id}>
                              {queue.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                    ) : null}

                    {node.nodeType === "webhook" ? (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          label={i18n.t("flowbuilder.fields.webhookUrl")}
                          value={node.url}
                          onChange={event => handleNodeChange(index, "url", event.target.value)}
                        />
                      </Grid>
                    ) : null}

                    {node.nodeType === "condition_contains" ? (
                      <>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            select
                            variant="outlined"
                            label={i18n.t("flowbuilder.fields.trueNext")}
                            value={node.trueNextNodeId}
                            onChange={event =>
                              handleNodeChange(index, "trueNextNodeId", event.target.value)
                            }
                          >
                            <MenuItem value="">{i18n.t("flowbuilder.noNextStep")}</MenuItem>
                            {form.nodes
                              .filter(option => option.clientId !== node.clientId)
                              .map(option => (
                                <MenuItem key={option.clientId} value={option.clientId}>
                                  {option.label || option.clientId}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            select
                            variant="outlined"
                            label={i18n.t("flowbuilder.fields.falseNext")}
                            value={node.falseNextNodeId}
                            onChange={event =>
                              handleNodeChange(index, "falseNextNodeId", event.target.value)
                            }
                          >
                            <MenuItem value="">{i18n.t("flowbuilder.noNextStep")}</MenuItem>
                            {form.nodes
                              .filter(option => option.clientId !== node.clientId)
                              .map(option => (
                                <MenuItem key={option.clientId} value={option.clientId}>
                                  {option.label || option.clientId}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>
                      </>
                    ) : (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          variant="outlined"
                          label={i18n.t("flowbuilder.fields.nextStep")}
                          value={node.nextNodeId}
                          onChange={event =>
                            handleNodeChange(index, "nextNodeId", event.target.value)
                          }
                        >
                          <MenuItem value="">{i18n.t("flowbuilder.noNextStep")}</MenuItem>
                          {form.nodes
                            .filter(option => option.clientId !== node.clientId)
                            .map(option => (
                              <MenuItem key={option.clientId} value={option.clientId}>
                                {option.label || option.clientId}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ))}

              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setForm(prev => ({
                    ...prev,
                    nodes: [...prev.nodes, createNode()]
                  }))
                }
              >
                {i18n.t("flowbuilder.addStep")}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary" variant="outlined">
            {i18n.t("flowbuilder.cancel")}
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            {i18n.t("flowbuilder.save")}
          </Button>
        </DialogActions>
      </Dialog>

      <MainHeader>
        <Title>{i18n.t("flowbuilder.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog(null)}>
            {i18n.t("flowbuilder.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Paper className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{i18n.t("flowbuilder.table.name")}</TableCell>
              <TableCell>{i18n.t("flowbuilder.table.keyword")}</TableCell>
              <TableCell>{i18n.t("flowbuilder.table.active")}</TableCell>
              <TableCell>{i18n.t("flowbuilder.table.steps")}</TableCell>
              <TableCell>{i18n.t("flowbuilder.table.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(flow => {
              const triggerConfig =
                typeof flow.triggerConfig === "string"
                  ? JSON.parse(flow.triggerConfig || "{}")
                  : {};

              return (
                <TableRow key={flow.id}>
                  <TableCell>{flow.name}</TableCell>
                  <TableCell>{triggerConfig.keyword || "-"}</TableCell>
                  <TableCell>{flow.isActive ? i18n.t("flowbuilder.active") : i18n.t("flowbuilder.inactive")}</TableCell>
                  <TableCell>{flow.nodes?.length || 0}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleOpenDialog(flow)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedFlow(flow);
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

export default Flowbuilder;
