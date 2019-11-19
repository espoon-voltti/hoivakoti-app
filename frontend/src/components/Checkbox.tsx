import React from "react";
import "../styles/Checkbox.scss";

interface Props {
	name: string;
	id: string;
	isChecked: boolean;
	onChange: (checked: boolean) => void;
}

const Checkbox: React.FunctionComponent<Props> = ({
	name,
	id,
	onChange,
	children,
	isChecked,
}) => {
	return (
		<div className="checkbox-container">
			<input
				checked={isChecked}
				onChange={event => {
					onChange(event.target.checked);
				}}
				name={name}
				type="checkbox"
				id={id}
				className="checkbox-button"
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
