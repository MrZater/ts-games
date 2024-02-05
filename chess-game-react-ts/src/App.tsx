import React from 'react';
import { GameComp } from './components/GameComp';

export class App extends React.Component<{}> {
  render(): React.ReactNode {
    return (<div>
      <GameComp/>
    </div>)
  }
}

export default App;
