import { Input } from '@nextui-org/react';

export default function StyledInput({ label, placeholder, type = "text", startContent, isInvalid, errorMessage, onChange }) {
    return (
        <Input 
            placeholder={placeholder} 
            label={label} 
            startContent={startContent}
            variant='bordered' 
            type={type}
            onChange={onChange} 
            isInvalid={isInvalid} 
            errorMessage={errorMessage}
        />
    );
}