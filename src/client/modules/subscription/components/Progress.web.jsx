import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'reactstrap';

const Steps = styled.div`
  display: table;
  width: 100%;
  position: relative;
`;

const StepRow = styled.div`
  display: table;
  margin: 0 auto;
`;

const Step = styled.div`
  display: table-cell;
  text-align: center;
  position: relative;
  padding: 0 10px;
`;

const CircularButton = styled(Button)`
  border-radius: 50% !important;
`;

const Progress = ({ step }) => (
  <Steps>
    <StepRow>
      <Step>
        <CircularButton outline={step !== 1} color={step === 1 ? 'primary' : 'secondary'}>
          1
        </CircularButton>
      </Step>
      <Step>
        <CircularButton outline={step !== 2} color={step === 2 ? 'primary' : 'secondary'}>
          2
        </CircularButton>
      </Step>
      <Step>
        <CircularButton outline={step !== 3} color={step === 3 ? 'primary' : 'secondary'}>
          3
        </CircularButton>
      </Step>
      <Step>
        <CircularButton outline={step !== 4} color={step === 4 ? 'primary' : 'secondary'}>
          4
        </CircularButton>
      </Step>
    </StepRow>
  </Steps>
);

Progress.propTypes = {
  step: PropTypes.number.isRequired
};

export default Progress;
