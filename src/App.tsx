import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
  isStreaming: boolean,
  intervalId: NodeJS.Timeout | undefined,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
      isStreaming: false,
      intervalId: undefined,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if(this.state.showGraph)
      return (<Graph data={this.state.data}/>)
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    let counter = 0
    const intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by spreading the old data along with new server responded data
        this.setState({
          data: [...this.state.data, ...serverResponds],
        });
      });
      counter++
      if (counter > 1000)
        this.toggleStreaming()  // stop updating graph after 1000 datapoints
    }, 100)
    this.setState({ intervalId, isStreaming: true })
  }

  toggleStreaming() {
    if (this.state.isStreaming) {
      this.state.intervalId && clearInterval(this.state.intervalId)
      this.setState({ isStreaming: false, intervalId: undefined })
    }
    else {
      this.getDataFromServer()
      this.setState({ showGraph: true})
    }
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => { this.toggleStreaming() }}>
            {this.state.isStreaming ? 'Stop' : 'Start'} Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
