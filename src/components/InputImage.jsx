import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/InputImage.module.css";
import { BiImage, BiTrash, BiX } from "react-icons/bi";
// import Button from "./Button";

const InputImage = ({
	refData,
	refDelBtn,
	defaultFile = null,
	hiddenDelete = false,
	style,
	required = true,
}) => {
	const mainFrame = useRef();

	const [content, setContent] = useState(defaultFile);
	const [isRendered, setRenderState] = useState(false);

	const handleOpenInput = () => {
		refData.current.click();
	};

	const handlePreview = (evt) => {
		setContent(URL.createObjectURL(evt.target.files[0]));
		if (mainFrame.current.style.width !== "unset") {
			mainFrame.current.style.marginBottom = 40 + "px";
		}
	};

	const handleRemoveImage = () => {
		setContent(null);
		refData.current.value = null;
		mainFrame.current.style.marginBottom = 0;
	};

	useEffect(() => {
		setContent(defaultFile);
		if (
			defaultFile !== null &&
			!hiddenDelete &&
			mainFrame.current.style.width !== "unset"
		) {
			mainFrame.current.style.marginBottom = 40 + "px";
		}
	}, [defaultFile]);

	return (
		<div
			id="main-frame"
			className={styles.InputImage}
			style={style}
			ref={mainFrame}
		>
			<input
				type="file"
				accept=".jpg, .png"
				ref={refData}
				className={styles.InputForm}
				onChange={handlePreview}
				required={required}
			/>
			<div
				className={`${styles.InputArea} ${content ? styles.Hidden : ""}`}
				onClick={handleOpenInput}
			>
				<BiImage className={styles.InputIcon} />
				<div className={styles.InputText}>Input gambar (max : 2 Mb)</div>
			</div>
			<div className={`${styles.InputPreview} ${content ? "" : styles.Hidden}`}>
				<img
					src={content}
					className={`${styles.PreviewImage} ${
						hiddenDelete ? styles.PreviewImage100 : ""
					}`}
					style={style}
				/>
				{hiddenDelete ? (
					<></>
				) : (
					<div className={`${styles.DeleteImage}`}>
						<button
							type="button"
							className={`btn btn-outline-danger`}
							onClick={handleRemoveImage}
							ref={refDelBtn}
						>
							<div className="d-flex m-auto">
								<BiTrash className="my-auto me-1" /> Hapus
							</div>
						</button>
					</div>
				)}
			</div>
			{!isRendered && defaultFile !== null ? setRenderState(true) : ""}
		</div>
	);
};

export default InputImage;
