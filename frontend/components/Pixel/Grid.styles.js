import { createUseStyles } from 'react-jss';

export default createUseStyles({
  grid: {
    display: 'grid',
    gridTemplateRows: 'repeat(32, 1fr)',
    gridTemplateColumns: 'repeat(32, 1fr)',
    width: '50vmin',
    height: '50vmin',
    // border: '1px solid black',
  },
  cell: {
    cursor: 'pointer',
    border: '.5px solid black',
    background: 'white',
    transition: 'all 200ms linear',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
});