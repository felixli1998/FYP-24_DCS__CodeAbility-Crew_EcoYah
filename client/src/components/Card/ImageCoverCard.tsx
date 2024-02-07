import * as React from 'react';
import { Box, Typography } from '@mui/material';

type ImageCoverCardType = {
  image: string;
  name: string;
};

export default function ImageCoverCard(props: ImageCoverCardType) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '20rem',
        overflow: 'hidden',
      }}
    >
      <Box
        component='img'
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        alt='donation event name'
        src={props.image}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '80%',
          padding: '1rem',
          opacity: '0.7',
          background: '#FFFFFF',
        }}
      >
        <Typography variant='h5'>{props.name}</Typography>
      </Box>
    </Box>
  );
}
