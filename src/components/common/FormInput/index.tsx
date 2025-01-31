
import {ChangeEvent} from 'react';
interface FormInputsProps {
    label: string;
    name: string;
    placeholder: string;
    type?: string;
    value: string; 
    error?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
}

const FormInput: React.FC<FormInputsProps> = ({
    label,
    name,
    placeholder,
    type = 'text',
    value,
    error,
    onChange,
    onBlur,
}) => {
    return (
        <div className='form-input-container'>
            <label>{label}</label>
            <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            />
            {error && <span className='error-message-quotes'>{error}</span>}
        </div>
    )
}

export default FormInput;