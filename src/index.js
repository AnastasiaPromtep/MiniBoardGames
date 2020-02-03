import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function Square(props) {
    if (props.victorySquare) {
        return (
          <button className="square victorySquare" onClick={props.onClick}>
            {props.value}
          </button>
        );
    }
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.numberOfColumn = 3;
        this.numberOfRows = 3;
    }

    renderSquare(i) {
        let victorySquare = false;
        if (this.props.victoryLine
            && (i === this.props.victoryLine[0]
            || i === this.props.victoryLine[1]
            || i === this.props.victoryLine[2])) {
            victorySquare = true;
        }

        return (
          <Square
          key={i}
          value={this.props.squares[i]}
          victorySquare={victorySquare}
          onClick={() => this.props.onClick(i)}
          />
        );
    }

  renderLine(i) {
      const rows = [];

      for (let n = 0; n < this.numberOfColumn; n++) {
          rows.push(this.renderSquare(i + n));
      }
      return (
          <div className="board-row" key={i}>
            {rows}
          </div>
      );
  }

  render() {
      const lines = [];
      for (let i = 0; i < this.numberOfRows; i++) {
          lines.push(this.renderLine(i * 3));
      }
      return (
      <div>
        {lines}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    history: [{
      squares: Array(9).fill(null),
    }],
    stepNumber: 0,
    xIsNext: true,
  };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const victoryLine = calculateWinner(current.squares);
    const winner = victoryLine ? current.squares[victoryLine[0]] : null;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move} className={move === this.state.stepNumber ? 'current' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status = '';

    if (winner) {
        status = 'Winner: ' + winner;
      } else if (this.state.stepNumber === 9) {
          status = 'Draw !'
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
      <div className="game">
        <div className="game-board">
        <Board
        squares={current.squares}
        victoryLine={victoryLine}
        onClick={(i) => this.handleClick(i)}
        />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
