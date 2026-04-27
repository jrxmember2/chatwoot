import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	Switch,
	TextField,
	Typography,
	makeStyles,
} from "@material-ui/core";
import { toast } from "react-toastify";

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import ButtonWithSpinner from "../ButtonWithSpinner";

const useStyles = makeStyles(theme => ({
	contactInfo: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(2),
		borderRadius: 8,
		backgroundColor: "#f5f5f5",
	},

	fileInfo: {
		marginTop: theme.spacing(1),
		wordBreak: "break-word",
	},
}));

const pad = value => String(value).padStart(2, "0");

const getInitialScheduleState = () => {
	const scheduleBase = new Date(Date.now() + 5 * 60 * 1000);

	return {
		sendDate: `${scheduleBase.getFullYear()}-${pad(
			scheduleBase.getMonth() + 1
		)}-${pad(scheduleBase.getDate())}`,
		sendTime: `${pad(scheduleBase.getHours())}:${pad(
			scheduleBase.getMinutes()
		)}`,
	};
};

const ScheduleMessageModal = ({ open, onClose, ticket }) => {
	const classes = useStyles();
	const fileInputRef = useRef(null);
	const { user } = useContext(AuthContext);

	const [message, setMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	const [sendDate, setSendDate] = useState("");
	const [sendTime, setSendTime] = useState("");
	const [signMessage, setSignMessage] = useState(true);
	const [loading, setLoading] = useState(false);

	const resetState = () => {
		const initialState = getInitialScheduleState();

		setMessage("");
		setSelectedFile(null);
		setSendDate(initialState.sendDate);
		setSendTime(initialState.sendTime);
		setSignMessage(true);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	useEffect(() => {
		if (open) {
			resetState();
		}
	}, [open, ticket?.id]);

	const closeModal = () => {
		resetState();
		onClose();
	};

	const handleClose = () => {
		if (loading) {
			return;
		}

		closeModal();
	};

	const handleFileChange = event => {
		const file = event.target.files && event.target.files[0];
		setSelectedFile(file || null);
	};

	const handleSubmit = async event => {
		event.preventDefault();

		const trimmedMessage = message.trim();

		if (!trimmedMessage && !selectedFile) {
			toast.error(i18n.t("scheduleMessageModal.errors.required"));
			return;
		}

		const scheduledAt = new Date(`${sendDate}T${sendTime}:00`);

		if (
			Number.isNaN(scheduledAt.getTime()) ||
			scheduledAt.getTime() <= Date.now()
		) {
			toast.error(i18n.t("scheduleMessageModal.errors.pastDate"));
			return;
		}

		if (!ticket?.id || !ticket?.contact?.id || !ticket?.whatsappId) {
			toast.error(
				i18n.t("backendErrors.ERR_SCHEDULED_MESSAGE_INVALID_TICKET_RELATION")
			);
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append("ticketId", String(ticket.id));
		formData.append("contactId", String(ticket.contact.id));
		formData.append("whatsappId", String(ticket.whatsappId));
		formData.append("body", trimmedMessage);
		formData.append("scheduledAt", scheduledAt.toISOString());
		formData.append("signMessage", String(signMessage));

		if (selectedFile) {
			formData.append("file", selectedFile);
		}

		try {
			await api.post("/scheduled-messages", formData);
			toast.success(i18n.t("scheduleMessageModal.success"));
			setLoading(false);
			closeModal();
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{i18n.t("scheduleMessageModal.title")}</DialogTitle>
				<DialogContent dividers>
					<div className={classes.contactInfo}>
						<Typography variant="body1">
							<strong>{i18n.t("scheduleMessageModal.contact")}:</strong>{" "}
							{ticket?.contact?.name || "-"}
						</Typography>
						<Typography variant="body1">
							<strong>{i18n.t("scheduleMessageModal.number")}:</strong>{" "}
							{ticket?.contact?.number || "-"}
						</Typography>
						<Typography variant="body1">
							<strong>{i18n.t("scheduleMessageModal.ticket")}:</strong> #
							{ticket?.id || "-"}
						</Typography>
					</div>

					<TextField
						label={i18n.t("scheduleMessageModal.message")}
						variant="outlined"
						fullWidth
						multiline
						rows={6}
						value={message}
						onChange={event => setMessage(event.target.value)}
					/>

					<input
						ref={fileInputRef}
						type="file"
						id="schedule-message-file"
						style={{ display: "none" }}
						accept="image/*,application/pdf,audio/*,video/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.rtf,.odt,.ods"
						onChange={handleFileChange}
					/>

					<div style={{ marginTop: 16 }}>
						<label htmlFor="schedule-message-file">
							<Button variant="outlined" color="primary" component="span">
								{i18n.t("scheduleMessageModal.attachFile")}
							</Button>
						</label>
						<Typography variant="body2" className={classes.fileInfo}>
							{i18n.t("scheduleMessageModal.selectedFile")}:{" "}
							{selectedFile ? selectedFile.name : "-"}
						</Typography>
					</div>

					<Grid container spacing={2} style={{ marginTop: 8 }}>
						<Grid item xs={12} sm={6}>
							<TextField
								label={i18n.t("scheduleMessageModal.sendDate")}
								type="date"
								variant="outlined"
								fullWidth
								required
								value={sendDate}
								onChange={event => setSendDate(event.target.value)}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label={i18n.t("scheduleMessageModal.sendTime")}
								type="time"
								variant="outlined"
								fullWidth
								required
								value={sendTime}
								onChange={event => setSendTime(event.target.value)}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
					</Grid>

					<FormControlLabel
						style={{ marginTop: 16 }}
						control={
							<Switch
								checked={signMessage}
								onChange={event => setSignMessage(event.target.checked)}
								color="primary"
							/>
						}
						label={`${i18n.t("scheduleMessageModal.signMessage")}${
							user?.name ? ` (${user.name})` : ""
						}`}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="secondary"
						variant="outlined"
						disabled={loading}
					>
						{i18n.t("scheduleMessageModal.cancel")}
					</Button>
					<ButtonWithSpinner
						type="submit"
						variant="contained"
						color="primary"
						loading={loading}
					>
						{i18n.t("scheduleMessageModal.confirm")}
					</ButtonWithSpinner>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default ScheduleMessageModal;
