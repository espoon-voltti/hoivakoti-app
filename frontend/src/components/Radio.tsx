import React from "react";
import "../styles/Radio.scss";

interface Props {
	name: string;
	id: string;
	isSelected: boolean;
	onChange: (checked: boolean) => void;
	tag?: string;
}

const Radio: React.FunctionComponent<Props> = ({
	name,
	id,
	onChange,
	children,
	isSelected,
	tag
}) => {
	return (
		<div className="radio-container">
			<input
				checked={isSelected}
				onChange={event => {
					onChange(event.target.checked);
				}}
				name={name}
				type="radio"
				id={id}
				className="radio-button"
			/>
			<label htmlFor={id} className={`radio-label ${tag ? " radio-label-taged" : ""}`}>
				<span
					className={`radio-box ${
						isSelected ? "radio-box-selected" : ""
					}${
						tag ? " radio-box-taged" : ""
					}`}
				>{tag}</span>
				<span className="radio-label-children">{children}</span>
			</label>
		</div>
	);
};

export default Radio;
