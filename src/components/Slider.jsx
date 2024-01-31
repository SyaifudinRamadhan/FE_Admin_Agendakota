import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Slider.module.css";
import {
	BiArrowBack,
	BiArrowToLeft,
	BiDockLeft,
	BiDockRight,
} from "react-icons/bi";

const Slider = ({
	content,
	style = {},
	className = {},
	navigatorStyle = {},
	navigatorClasses = [],
	distanceCard = 0,
	widthCard = 313,
}) => {
	const mainFrameScroll = useRef(null);
	const sliderBox = useRef(null);
	const [framePosition, setFramePosition] = useState(0);
	const classNames = [styles.Content].concat(className);
	const classsNamesNav = [styles.Navigator].concat(navigatorClasses);

	const handleNext = (framePosition) => {
		let widthFrame = mainFrameScroll.current.offsetWidth;
		let widthSliderBox = sliderBox.current.clientWidth;
		let valScroll = widthCard + distanceCard;
		if (-framePosition >= widthFrame - widthSliderBox) {
			setFramePosition(0);
		} else {
			let position = framePosition - valScroll;
			if (widthFrame + position <= widthSliderBox) {
				setFramePosition(-(widthFrame - widthSliderBox));
			} else {
				setFramePosition(position);
			}
		}
	};

	const hanldePrev = (framePosition) => {
		let widthFrame = mainFrameScroll.current.offsetWidth;
		let widthSliderBox = sliderBox.current.clientWidth;
		let valScroll = widthCard + distanceCard;
		if (-framePosition <= 0) {
			setFramePosition(-(widthFrame - widthSliderBox));
		} else {
			if (-framePosition - valScroll <= 0) {
				setFramePosition(0);
			} else {
				setFramePosition(framePosition + valScroll);
			}
		}
	};

	const handleWidth = () => {
		try {
			let widthFrame = mainFrameScroll.current.offsetWidth;
			let widthSliderBox = sliderBox.current.clientWidth;
			if (widthFrame < widthSliderBox) {
				mainFrameScroll.current.style.width = "100%";
			} else {
				mainFrameScroll.current.style.removeProperty("width");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		handleWidth();
		window.addEventListener("resize", handleWidth);
	});

	return (
		<div className={styles.SliderBox} ref={sliderBox}>
			<div
				className={classNames.join(" ")}
				style={{ ...style, transform: `translate(${framePosition}px, 0px)` }}
				ref={mainFrameScroll}
			>
				{content}
			</div>
			<div className={classsNamesNav.join(" ")} style={navigatorStyle}>
				<div
					className={`${styles.ButtonNav} ${styles.ButtonNavLeft}`}
					onClick={() => {
						hanldePrev(framePosition);
					}}
				>
					<BiArrowBack className={styles.IconLeft} />
				</div>
				<div
					className={`${styles.ButtonNav} ${styles.ButtonNavRight}`}
					onClick={() => {
						handleNext(framePosition);
					}}
				>
					<BiArrowBack className={styles.IconRight} />
				</div>
			</div>
		</div>
	);
};

export default Slider;
