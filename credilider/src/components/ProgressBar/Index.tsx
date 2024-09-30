interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar = ({ currentStep }: ProgressBarProps) => {
    return (
      <div>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px',
              backgroundColor: currentStep === 1 ? '#4caf50' : '#ccc',
            }}
          >
            Preaprobado
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '10px',
              backgroundColor: currentStep === 2 ? '#4caf50' : '#ccc',
            }}
          >
            Solicitud Crédito
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;
  