import { useDispatch } from 'react-redux';
import { settingActions } from '../../store/setting';

import './About.scss';

const About = () => {
  const dispatch = useDispatch();

  const backHandler = () => {
    dispatch(settingActions.showAboutHandler());
  };

  return (
    <div className='about'>
      <h2 className='about__title'>About The Project</h2>
      <div className='about__content'>
        <p>
          This is the thesis project for my Bachelor thesis in South-Eastern Finland University of Applied Sciences. The aim of the project is to
          implement Dobutsu Shogi board game and its simple AI using Minimax algorithm and Alpha-beta pruning technique. The algorithm in this project
          is applied with the depth equals 7. Development technologies used: React, Typescript, Redux, SASS.
        </p>
        <br></br>
        <p>
          Dobutsu Shogi is invented by a female professional Shogi player Madoka Kitao. It is a two-player game that is played on a 3x4 board. Each
          player starts the game with four pieces: Lion, Giraffe, Elephant, and Chick. The dots on each piece describe how that piece moves, but only
          one square per move. Like in Shogi, pieces that are captured will change side and be sent to the hand of player who capture it. When it is
          that player’s turn, instead of moving a piece, he or she can drop a captured piece back to the board. Unlike in Shogi, there are no
          restrictions about how a player can drop a chick. Additionally, when Chick reaches the furthest row, it will be promoted to Hen, and when a
          Hen is captured, it will be demoted back to Chick. A Hen can move one square in any direction, except diagonally backwards.
        </p>
        <br></br>
        <p>
          In order to win the game, players need to capture their opponent’s Lion, or move their own Lion to the furthest rank without being captured
          in the next move (stalemate is also a win). If two players play the same move three times in a row, the game will end in a draw.{' '}
        </p>
      </div>
      <button className='btn about__btn' onClick={backHandler}>
        Back
      </button>
    </div>
  );
};

export default About;
