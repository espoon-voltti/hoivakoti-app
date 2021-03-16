import React from "react";
import "../styles/Checkbox.scss";

interface Props {
	name: string;
	id: string;
	isChecked: boolean;
	onChange: (checked: boolean) => void;
	onBlur?: () => void;
	disabled?: boolean;
}

const Checkbox: React.FunctionComponent<Props> = ({
	name,
	id,
	onChange,
	onBlur,
	children,
	isChecked,
	disabled,
}) => {
	return (
		<div
			className={
				disabled ? "checkbox-container disabled" : "checkbox-container"
			}
		>
			<input
				checked={isChecked}
				onChange={event => {
					onChange(event.target.checked);
				}}
				name={name}
				type="checkbox"
				id={id}
				className="checkbox-button"
				onBlur={onBlur}
				disabled={disabled as boolean}
			/>
			<label htmlFor={id} className="checkbox-label">
				<span
					className={`checkbox-box ${
						isChecked ? "checkbox-box-selected" : ""
					}`}
				></span>
				<span className="checkbox-label-children">{children}</span>
			</label>
		</div>
	);
};

export default Checkbox;
