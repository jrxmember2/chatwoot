import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Button,
  FormControlLabel,
  Grid,
  Paper,
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
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { BrandingContext } from "../../context/Branding/BrandingContext";
import { AuthContext } from "../../context/Auth/AuthContext";

const acceptedFileTypes =
  "image/png,image/jpeg,image/jpg,image/webp,image/x-icon,image/vnd.microsoft.icon,.ico";

const buildInitialFormState = data => ({
  loginLogoUrl: data?.loginLogoUrl || "",
  internalLogoUrl: data?.internalLogoUrl || "",
  faviconUrl: data?.faviconUrl || "",
  systemName: data?.systemName || "WhaTicket",
  pageTitle: data?.pageTitle || "WhaTicket",
  primaryColor: data?.primaryColor || "#2576d2",
  secondaryColor: data?.secondaryColor || "#f50057",
  loginFooterText: data?.loginFooterText || "",
  showLoginLogo:
    data?.showLoginLogo === undefined ? true : Boolean(data.showLoginLogo),
  showInternalLogo:
    data?.showInternalLogo === undefined ? true : Boolean(data.showInternalLogo)
});

const createEmptyFileState = () => ({
  loginLogo: { file: null, previewUrl: "" },
  internalLogo: { file: null, previewUrl: "" },
  favicon: { file: null, previewUrl: "" }
});

const useStyles = makeStyles(theme => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    overflowY: "auto",
    ...theme.scrollbarStyles
  },
  sectionTitle: {
    marginBottom: theme.spacing(2)
  },
  previewBox: {
    width: "100%",
    minHeight: 140,
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: 120,
    objectFit: "contain"
  },
  helperText: {
    marginTop: theme.spacing(1)
  },
  colorField: {
    width: "100%"
  },
  footerField: {
    marginTop: theme.spacing(1)
  }
}));

const Branding = () => {
  const classes = useStyles();
  const history = useHistory();
  const { branding, refreshBranding } = useContext(BrandingContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(buildInitialFormState(branding));
  const [selectedFiles, setSelectedFiles] = useState(createEmptyFileState);

  useEffect(() => {
    if (user && user.profile !== "admin") {
      toast.error(i18n.t("backendErrors.ERR_NO_PERMISSION"));
      history.replace("/");
      return;
    }

    const loadBranding = async () => {
      try {
        const { data } = await api.get("/branding");
        setFormData(buildInitialFormState(data));
      } catch (error) {
        toastError(error);
      } finally {
        setLoading(false);
      }
    };

    loadBranding();
  }, [history, user]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSwitchChange = event => {
    const { name, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  const handleFileChange = (fieldName, file) => {
    setSelectedFiles(prevState => {
      if (prevState[fieldName].previewUrl) {
        URL.revokeObjectURL(prevState[fieldName].previewUrl);
      }

      return {
        ...prevState,
        [fieldName]: {
          file,
          previewUrl: file ? URL.createObjectURL(file) : ""
        }
      };
    });
  };

  const getPreviewUrl = fieldName => {
    const selectedFile = selectedFiles[fieldName];

    if (selectedFile.previewUrl) {
      return selectedFile.previewUrl;
    }

    if (fieldName === "loginLogo") {
      return formData.loginLogoUrl;
    }

    if (fieldName === "internalLogo") {
      return formData.internalLogoUrl;
    }

    return formData.faviconUrl;
  };

  const resetSelectedFiles = () => {
    Object.values(selectedFiles).forEach(fileState => {
      if (fileState.previewUrl) {
        URL.revokeObjectURL(fileState.previewUrl);
      }
    });

    setSelectedFiles(createEmptyFileState());
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      await api.put("/branding", {
        systemName: formData.systemName,
        pageTitle: formData.pageTitle,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        loginFooterText: formData.loginFooterText,
        showLoginLogo: formData.showLoginLogo,
        showInternalLogo: formData.showInternalLogo
      });

      const uploadData = new FormData();

      if (selectedFiles.loginLogo.file) {
        uploadData.append("loginLogo", selectedFiles.loginLogo.file);
      }

      if (selectedFiles.internalLogo.file) {
        uploadData.append("internalLogo", selectedFiles.internalLogo.file);
      }

      if (selectedFiles.favicon.file) {
        uploadData.append("favicon", selectedFiles.favicon.file);
      }

      if (Array.from(uploadData.keys()).length > 0) {
        await api.post("/branding/upload", uploadData);
      }

      const updatedBranding = await refreshBranding();
      setFormData(buildInitialFormState(updatedBranding));
      resetSelectedFiles();
      toast.success(i18n.t("branding.success"));
    } catch (error) {
      toastError(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <BackdropLoading />;
  }

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t("branding.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? i18n.t("branding.buttons.saving") : i18n.t("branding.buttons.save")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <Paper className={classes.mainPaper} variant="outlined">
        <Typography variant="body2" color="textSecondary" className={classes.sectionTitle}>
          {i18n.t("branding.description")}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">
              {i18n.t("branding.fields.loginLogo")}
            </Typography>
            <div className={classes.previewBox}>
              {getPreviewUrl("loginLogo") ? (
                <img
                  src={getPreviewUrl("loginLogo")}
                  alt={i18n.t("branding.fields.loginLogo")}
                  className={classes.previewImage}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {i18n.t("branding.preview.empty")}
                </Typography>
              )}
            </div>
            <Typography variant="caption" display="block" className={classes.helperText}>
              {selectedFiles.loginLogo.file
                ? selectedFiles.loginLogo.file.name
                : i18n.t("branding.preview.current")}
            </Typography>
            <Button
              component="label"
              variant="outlined"
              color="primary"
              fullWidth
            >
              {i18n.t("branding.buttons.selectLoginLogo")}
              <input
                hidden
                type="file"
                accept={acceptedFileTypes}
                onChange={event =>
                  handleFileChange("loginLogo", event.target.files[0] || null)
                }
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">
              {i18n.t("branding.fields.internalLogo")}
            </Typography>
            <div className={classes.previewBox}>
              {getPreviewUrl("internalLogo") ? (
                <img
                  src={getPreviewUrl("internalLogo")}
                  alt={i18n.t("branding.fields.internalLogo")}
                  className={classes.previewImage}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {i18n.t("branding.preview.empty")}
                </Typography>
              )}
            </div>
            <Typography variant="caption" display="block" className={classes.helperText}>
              {selectedFiles.internalLogo.file
                ? selectedFiles.internalLogo.file.name
                : i18n.t("branding.preview.current")}
            </Typography>
            <Button
              component="label"
              variant="outlined"
              color="primary"
              fullWidth
            >
              {i18n.t("branding.buttons.selectInternalLogo")}
              <input
                hidden
                type="file"
                accept={acceptedFileTypes}
                onChange={event =>
                  handleFileChange("internalLogo", event.target.files[0] || null)
                }
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1">
              {i18n.t("branding.fields.favicon")}
            </Typography>
            <div className={classes.previewBox}>
              {getPreviewUrl("favicon") ? (
                <img
                  src={getPreviewUrl("favicon")}
                  alt={i18n.t("branding.fields.favicon")}
                  className={classes.previewImage}
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {i18n.t("branding.preview.empty")}
                </Typography>
              )}
            </div>
            <Typography variant="caption" display="block" className={classes.helperText}>
              {selectedFiles.favicon.file
                ? selectedFiles.favicon.file.name
                : i18n.t("branding.preview.current")}
            </Typography>
            <Button
              component="label"
              variant="outlined"
              color="primary"
              fullWidth
            >
              {i18n.t("branding.buttons.selectFavicon")}
              <input
                hidden
                type="file"
                accept={acceptedFileTypes}
                onChange={event =>
                  handleFileChange("favicon", event.target.files[0] || null)
                }
              />
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={i18n.t("branding.fields.systemName")}
              name="systemName"
              value={formData.systemName}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={i18n.t("branding.fields.pageTitle")}
              name="pageTitle"
              value={formData.pageTitle}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={i18n.t("branding.fields.primaryColor")}
              name="primaryColor"
              type="color"
              value={formData.primaryColor}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              className={classes.colorField}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label={i18n.t("branding.fields.secondaryColor")}
              name="secondaryColor"
              type="color"
              value={formData.secondaryColor}
              onChange={handleInputChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              className={classes.colorField}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={i18n.t("branding.fields.loginFooterText")}
              name="loginFooterText"
              value={formData.loginFooterText}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
              multiline
              rowsMin={3}
              className={classes.footerField}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={formData.showLoginLogo}
                  onChange={handleSwitchChange}
                  name="showLoginLogo"
                />
              }
              label={i18n.t("branding.fields.showLoginLogo")}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={formData.showInternalLogo}
                  onChange={handleSwitchChange}
                  name="showInternalLogo"
                />
              }
              label={i18n.t("branding.fields.showInternalLogo")}
            />
          </Grid>
        </Grid>
      </Paper>
    </MainContainer>
  );
};

export default Branding;
