import React, { useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

import { makeStyles } from "@material-ui/core/styles";
import { green, orange, red } from "@material-ui/core/colors";
import {
	Button,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	Table,
	TableHead,
	Paper,
	Tooltip,
	Typography,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@material-ui/core";
import {
	Edit,
	CheckCircle,
	DeleteOutline,
} from "@material-ui/icons";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import TableRowSkeleton from "../../components/TableRowSkeleton";

import api from "../../services/api";
import WhatsAppModal from "../../components/WhatsAppModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import QrcodeModal from "../../components/QrcodeModal";
import { i18n } from "../../translate/i18n";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
	mainPaper: {
		flex: 1,
		padding: theme.spacing(1),
		overflowY: "scroll",
		...theme.scrollbarStyles,
	},
	customTableCell: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		fontSize: theme.typography.pxToRem(14),
		border: "1px solid #dadde9",
		maxWidth: 450,
	},
	tooltipPopper: {
		textAlign: "center",
	},
	buttonProgress: {
		color: green[500],
	},
	importStatusCell: {
		minWidth: 220,
	},
	importStatusText: {
		fontWeight: 500,
	},
	importMetaText: {
		display: "block",
		marginTop: theme.spacing(0.5),
	},
	importActionButton: {
		marginTop: theme.spacing(1),
	},
	connectionNameCell: {
		display: "flex",
		flexDirection: "column",
		gap: theme.spacing(0.5),
	},
	providerMeta: {
		fontSize: theme.typography.pxToRem(12),
		color: theme.palette.text.secondary,
	},
	instanceMeta: {
		fontSize: theme.typography.pxToRem(12),
		color: theme.palette.text.secondary,
	},
	statusWrapper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: theme.spacing(1),
	},
	statusText: {
		fontWeight: 500,
	},
	trafficLight: {
		width: 18,
		minWidth: 18,
		borderRadius: 12,
		backgroundColor: theme.palette.type === "dark" ? "#2b2b2b" : "#1f1f1f",
		padding: theme.spacing(0.5),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 3,
	},
	trafficLightLamp: {
		width: 8,
		height: 8,
		borderRadius: "50%",
		backgroundColor: "#555",
		opacity: 0.45,
	},
	trafficLightLampRed: {
		backgroundColor: red[500],
		opacity: 1,
		boxShadow: `0 0 8px ${red[300]}`,
	},
	trafficLightLampYellow: {
		backgroundColor: orange[500],
		opacity: 1,
		boxShadow: `0 0 8px ${orange[300]}`,
	},
	trafficLightLampGreen: {
		backgroundColor: green[500],
		opacity: 1,
		boxShadow: `0 0 8px ${green[300]}`,
	},
}));

const CustomToolTip = ({ title, content, children }) => {
	const classes = useStyles();

	return (
		<Tooltip
			arrow
			classes={{
				tooltip: classes.tooltip,
				popper: classes.tooltipPopper,
			}}
			title={
				<React.Fragment>
					<Typography gutterBottom color="inherit">
						{title}
					</Typography>
					{content && <Typography>{content}</Typography>}
				</React.Fragment>
			}
		>
			{children}
		</Tooltip>
	);
};

const Connections = () => {
	const classes = useStyles();

	const { whatsApps, loading } = useContext(WhatsAppsContext);
	const { user } = useContext(AuthContext);
	const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [importModalOpen, setImportModalOpen] = useState(false);
	const [importDays, setImportDays] = useState(20);
	const [syncingImport, setSyncingImport] = useState(false);
	const confirmationModalInitialState = {
		action: "",
		title: "",
		message: "",
		whatsAppId: "",
		open: false,
	};
	const [confirmModalInfo, setConfirmModalInfo] = useState(
		confirmationModalInitialState
	);
	const isAdmin = user?.profile === "admin";

	const handleStartWhatsAppSession = async whatsAppId => {
		try {
			await api.post(`/whatsappsession/${whatsAppId}`);
		} catch (err) {
			toastError(err);
		}
	};

	const handleRequestNewQrCode = async whatsAppId => {
		try {
			await api.put(`/whatsappsession/${whatsAppId}`);
		} catch (err) {
			toastError(err);
		}
	};

	const handleOpenWhatsAppModal = () => {
		setSelectedWhatsApp(null);
		setWhatsAppModalOpen(true);
	};

	const handleCloseWhatsAppModal = useCallback(() => {
		setWhatsAppModalOpen(false);
		setSelectedWhatsApp(null);
	}, [setSelectedWhatsApp, setWhatsAppModalOpen]);

	const handleOpenQrModal = whatsApp => {
		setSelectedWhatsApp(whatsApp);
		setQrModalOpen(true);
	};

	const handleCloseQrModal = useCallback(() => {
		setSelectedWhatsApp(null);
		setQrModalOpen(false);
	}, [setQrModalOpen, setSelectedWhatsApp]);

	const handleEditWhatsApp = whatsApp => {
		setSelectedWhatsApp(whatsApp);
		setWhatsAppModalOpen(true);
	};

	const handleOpenImportModal = whatsApp => {
		setSelectedWhatsApp(whatsApp);
		setImportDays(whatsApp.importOldMessagesDays || 20);
		setImportModalOpen(true);
	};

	const handleCloseImportModal = () => {
		setImportModalOpen(false);
		setSelectedWhatsApp(null);
		setImportDays(20);
	};

	const handleOpenConfirmationModal = (action, whatsAppId) => {
		if (action === "disconnect") {
			setConfirmModalInfo({
				action: action,
				title: i18n.t("connections.confirmationModal.disconnectTitle"),
				message: i18n.t("connections.confirmationModal.disconnectMessage"),
				whatsAppId: whatsAppId,
			});
		}

		if (action === "delete") {
			setConfirmModalInfo({
				action: action,
				title: i18n.t("connections.confirmationModal.deleteTitle"),
				message: i18n.t("connections.confirmationModal.deleteMessage"),
				whatsAppId: whatsAppId,
			});
		}
		setConfirmModalOpen(true);
	};

	const handleSubmitConfirmationModal = async () => {
		if (confirmModalInfo.action === "disconnect") {
			try {
				await api.delete(`/whatsappsession/${confirmModalInfo.whatsAppId}`);
			} catch (err) {
				toastError(err);
			}
		}

		if (confirmModalInfo.action === "delete") {
			try {
				await api.delete(`/whatsapp/${confirmModalInfo.whatsAppId}`);
				toast.success(i18n.t("connections.toasts.deleted"));
			} catch (err) {
				toastError(err);
			}
		}

		setConfirmModalInfo(confirmationModalInitialState);
	};

	const handleStartOldMessagesImport = async () => {
		const normalizedDays = Number(importDays);

		if (!Number.isInteger(normalizedDays) || normalizedDays < 1 || normalizedDays > 90) {
			toast.error(i18n.t("connections.importOldMessagesValidationDays"));
			return;
		}

		try {
			setSyncingImport(true);
			await api.post(
				`/whatsapp/${selectedWhatsApp.id}/import-old-messages`,
				{ days: normalizedDays }
			);
			toast.success(i18n.t("connections.importOldMessagesStarted"));
			handleCloseImportModal();
		} catch (err) {
			toastError(err);
		} finally {
			setSyncingImport(false);
		}
	};

	const getImportStatusLabel = whatsApp => {
		if (whatsApp.provider === "evolution") {
			return i18n.t("connections.importNotAvailableEvolution");
		}

		const status = whatsApp.oldMessagesImportStatus || "idle";

		if (status === "running") {
			return i18n.t("connections.importOldMessagesRunning");
		}

		if (status === "pending") {
			return i18n.t("connections.importOldMessagesPending");
		}

		if (status === "done") {
			return i18n.t("connections.importOldMessagesDone");
		}

		if (status === "failed") {
			return i18n.t("connections.importOldMessagesFailed");
		}

		return i18n.t("connections.importOldMessagesIdle");
	};

	const getImportErrorMessage = errorCode => {
		if (!errorCode) {
			return "";
		}

		if (i18n.exists(`backendErrors.${errorCode}`)) {
			return i18n.t(`backendErrors.${errorCode}`);
		}

		return errorCode;
	};

	const renderImportStatus = whatsApp => {
		if (whatsApp.provider === "evolution") {
			return (
				<div className={classes.importStatusCell}>
					<Typography variant="body2" color="textSecondary">
						{i18n.t("connections.importNotAvailableEvolution")}
					</Typography>
				</div>
			);
		}

		const isRunning = whatsApp.oldMessagesImportStatus === "running";
		const canTriggerNow = whatsApp.status === "CONNECTED" && !isRunning;
		const lastImportAt = whatsApp.lastOldMessagesImportAt
			? format(parseISO(whatsApp.lastOldMessagesImportAt), "dd/MM/yy HH:mm")
			: null;

		return (
			<div className={classes.importStatusCell}>
				<Typography variant="body2" className={classes.importStatusText}>
					{getImportStatusLabel(whatsApp)}
				</Typography>
				{whatsApp.importOldMessagesDays ? (
					<Typography variant="caption" color="textSecondary" className={classes.importMetaText}>
						{i18n.t("connections.importOldMessagesDays")}: {whatsApp.importOldMessagesDays}
					</Typography>
				) : null}
				{lastImportAt ? (
					<Typography variant="caption" color="textSecondary" className={classes.importMetaText}>
						{i18n.t("connections.importOldMessagesLastRun")}: {lastImportAt}
					</Typography>
				) : null}
				{whatsApp.oldMessagesImportStatus === "failed" && whatsApp.oldMessagesImportError ? (
					<Typography variant="caption" color="error" className={classes.importMetaText}>
						{getImportErrorMessage(whatsApp.oldMessagesImportError)}
					</Typography>
				) : null}
				{isAdmin ? (
					<Button
						size="small"
						variant="outlined"
						color="primary"
						disabled={!canTriggerNow}
						onClick={() => handleOpenImportModal(whatsApp)}
						className={classes.importActionButton}
					>
						{isRunning
							? i18n.t("connections.importOldMessagesRunning")
							: i18n.t("connections.importOldMessagesNow")}
					</Button>
				) : null}
			</div>
		);
	};

	const renderActionButtons = whatsApp => {
		if (whatsApp.provider === "evolution") {
			return (
				<>
					<Button
						size="small"
						variant="outlined"
						color="primary"
						onClick={() => handleStartWhatsAppSession(whatsApp.id)}
					>
						{whatsApp.status === "OPENING"
							? i18n.t("connections.buttons.syncingStatus")
							: i18n.t("connections.buttons.syncStatus")}
					</Button>
					{whatsApp.status === "CONNECTED" && (
						<Button
							size="small"
							variant="outlined"
							color="secondary"
							onClick={() => {
								handleOpenConfirmationModal("disconnect", whatsApp.id);
							}}
						>
							{i18n.t("connections.buttons.disconnect")}
						</Button>
					)}
				</>
			);
		}

		return (
			<>
				{whatsApp.status === "qrcode" && (
					<Button
						size="small"
						variant="contained"
						color="primary"
						onClick={() => handleOpenQrModal(whatsApp)}
					>
						{i18n.t("connections.buttons.qrcode")}
					</Button>
				)}
				{whatsApp.status === "DISCONNECTED" && (
					<>
						<Button
							size="small"
							variant="outlined"
							color="primary"
							onClick={() => handleStartWhatsAppSession(whatsApp.id)}
						>
							{i18n.t("connections.buttons.tryAgain")}
						</Button>{" "}
						<Button
							size="small"
							variant="outlined"
							color="secondary"
							onClick={() => handleRequestNewQrCode(whatsApp.id)}
						>
							{i18n.t("connections.buttons.newQr")}
						</Button>
					</>
				)}
				{(whatsApp.status === "CONNECTED" ||
					whatsApp.status === "PAIRING" ||
					whatsApp.status === "TIMEOUT") && (
					<Button
						size="small"
						variant="outlined"
						color="secondary"
						onClick={() => {
							handleOpenConfirmationModal("disconnect", whatsApp.id);
						}}
					>
						{i18n.t("connections.buttons.disconnect")}
					</Button>
				)}
				{whatsApp.status === "OPENING" && (
					<Button size="small" variant="outlined" disabled color="default">
						{i18n.t("connections.buttons.connecting")}
					</Button>
				)}
			</>
		);
	};

	const renderStatusToolTips = whatsApp => {
		const isConnected = whatsApp.status === "CONNECTED";
		const isWarning =
			whatsApp.status === "OPENING" ||
			whatsApp.status === "qrcode" ||
			whatsApp.status === "PAIRING" ||
			whatsApp.status === "TIMEOUT";
		const statusLabel = isConnected
			? i18n.t("connections.statusLabels.connected")
			: isWarning
				? i18n.t("connections.statusLabels.syncing")
				: i18n.t("connections.statusLabels.disconnected");
		const providerLabel = i18n.t(
			`connections.providers.${whatsApp.provider || "wwebjs"}`
		);
		const tooltipTitle = `${statusLabel} • ${providerLabel}`;
		const tooltipContent =
			whatsApp.provider === "evolution"
				? i18n.t("connections.evolutionInfo")
				: whatsApp.status === "DISCONNECTED"
					? i18n.t("connections.toolTips.disconnected.content")
					: whatsApp.status === "qrcode"
						? i18n.t("connections.toolTips.qrcode.content")
						: whatsApp.status === "TIMEOUT" || whatsApp.status === "PAIRING"
							? i18n.t("connections.toolTips.timeout.content")
							: "";

		return (
			<CustomToolTip title={tooltipTitle} content={tooltipContent}>
				<div className={classes.statusWrapper}>
					<div className={classes.trafficLight}>
						<span
							className={`${classes.trafficLightLamp} ${
								!isConnected && !isWarning ? classes.trafficLightLampRed : ""
							}`}
						/>
						<span
							className={`${classes.trafficLightLamp} ${
								isWarning ? classes.trafficLightLampYellow : ""
							}`}
						/>
						<span
							className={`${classes.trafficLightLamp} ${
								isConnected ? classes.trafficLightLampGreen : ""
							}`}
						/>
					</div>
					<Typography variant="body2" className={classes.statusText}>
						{statusLabel}
					</Typography>
				</div>
			</CustomToolTip>
		);
	};

	return (
		<MainContainer>
			<ConfirmationModal
				title={confirmModalInfo.title}
				open={confirmModalOpen}
				onClose={setConfirmModalOpen}
				onConfirm={handleSubmitConfirmationModal}
			>
				{confirmModalInfo.message}
			</ConfirmationModal>
			<QrcodeModal
				open={qrModalOpen}
				onClose={handleCloseQrModal}
				whatsAppId={!whatsAppModalOpen && selectedWhatsApp?.id}
			/>
			<WhatsAppModal
				open={whatsAppModalOpen}
				onClose={handleCloseWhatsAppModal}
				whatsAppId={!qrModalOpen && selectedWhatsApp?.id}
			/>
			<Dialog
				open={importModalOpen}
				onClose={handleCloseImportModal}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>{i18n.t("connections.importOldMessagesNow")}</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						fullWidth
						type="number"
						variant="outlined"
						margin="dense"
						label={i18n.t("connections.importOldMessagesDays")}
						value={importDays}
						onChange={event => setImportDays(event.target.value)}
						inputProps={{ min: 1, max: 90 }}
						placeholder="20"
						helperText={i18n.t("connections.importOldMessagesHelp")}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseImportModal} color="secondary" variant="outlined">
						{i18n.t("confirmationModal.buttons.cancel")}
					</Button>
					<Button
						onClick={handleStartOldMessagesImport}
						color="primary"
						variant="contained"
						disabled={syncingImport}
					>
						{syncingImport
							? i18n.t("connections.importOldMessagesRunning")
							: i18n.t("connections.importOldMessagesNow")}
					</Button>
				</DialogActions>
			</Dialog>
			<MainHeader>
				<Title>{i18n.t("connections.title")}</Title>
				<MainHeaderButtonsWrapper>
					<Button
						variant="contained"
						color="primary"
						onClick={handleOpenWhatsAppModal}
					>
						{i18n.t("connections.buttons.add")}
					</Button>
				</MainHeaderButtonsWrapper>
			</MainHeader>
			<Paper className={classes.mainPaper} variant="outlined">
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell align="center">
								{i18n.t("connections.table.name")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("connections.table.status")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("connections.table.session")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("connections.table.lastUpdate")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("connections.table.default")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("connections.importOldMessagesStatus")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("connections.table.actions")}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRowSkeleton />
						) : (
							<>
								{whatsApps?.length > 0 &&
									whatsApps.map(whatsApp => (
										<TableRow key={whatsApp.id}>
											<TableCell align="center">
												<div className={classes.connectionNameCell}>
													<Typography variant="body2">
														{whatsApp.name}
													</Typography>
													<Typography
														variant="caption"
														className={classes.providerMeta}
													>
														{i18n.t("connections.provider")}:{" "}
														{i18n.t(
															`connections.providers.${
																whatsApp.provider || "wwebjs"
															}`
														)}
													</Typography>
													{whatsApp.provider === "evolution" &&
													whatsApp.evolutionInstanceName ? (
														<Typography
															variant="caption"
															className={classes.instanceMeta}
														>
															{i18n.t("connections.evolutionInstance")}:{" "}
															{whatsApp.evolutionInstanceName}
														</Typography>
													) : null}
												</div>
											</TableCell>
											<TableCell align="center">
												{renderStatusToolTips(whatsApp)}
											</TableCell>
											<TableCell align="center">
												{renderActionButtons(whatsApp)}
											</TableCell>
											<TableCell align="center">
												{format(parseISO(whatsApp.updatedAt), "dd/MM/yy HH:mm")}
											</TableCell>
											<TableCell align="center">
												{whatsApp.isDefault && (
													<div className={classes.customTableCell}>
														<CheckCircle style={{ color: green[500] }} />
													</div>
												)}
											</TableCell>
											<TableCell align="center">
												{renderImportStatus(whatsApp)}
											</TableCell>
											<TableCell align="center">
												<IconButton
													size="small"
													onClick={() => handleEditWhatsApp(whatsApp)}
												>
													<Edit />
												</IconButton>

												<IconButton
													size="small"
													onClick={e => {
														handleOpenConfirmationModal("delete", whatsApp.id);
													}}
												>
													<DeleteOutline />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
							</>
						)}
					</TableBody>
				</Table>
			</Paper>
		</MainContainer>
	);
};

export default Connections;
