import React from 'react';
import { useWeatherApp } from '../store';
import Details from './Details';
import styled from 'styled-components';

const Root = styled.div`
  height: 100vh;
`;

function App() {
  const { state: { position, forecast, query, error }, setQuery, setPosition } = useWeatherApp();

  return (
    <Root>
      <Details
        forecast={forecast}
        position={position}
        query={query}
        onSetQuery={setQuery}
        onSetPosition={setPosition}
        error={error}
      />
    </Root>
  );
}

export default App;
