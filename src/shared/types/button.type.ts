export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingLabel?: string;
    variant?: "primary" | "outline" | "ghost";
    fullWidth?: boolean;
}