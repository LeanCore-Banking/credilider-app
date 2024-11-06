import "./styles.css"

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar = ({ currentStep }: ProgressBarProps) => {
    return (
      <div className="progress-bar-container">
      <div className="step-container">
        <div className={`step-item ${currentStep === 1 ? 'active' : ''}`}>
          1 Consultar Pre-Aprobado
        </div>
        <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
          2 Solicitud Crédito
        </div>
      </div>
    </div>
    
    );
  };
  
  export default ProgressBar;
  