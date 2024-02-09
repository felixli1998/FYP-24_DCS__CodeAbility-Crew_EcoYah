import React from 'react';
import Image from '../../components/Image/Image';
import { Box } from '@mui/material';

const ImageComponentExample: React.FC = () => {
  return (
    <Box m={2}>
      <h1>Image Component Example</h1>
      Standard, local, not editable square image.
      <Image
        type='circle'
        width='125px'
        height='125px'
        folderPrefix='default'
      />
      Standard, local, editable square image.
      <Image
        type='rectangle'
        editable={true}
        folderPrefix='default'
      />
      Standard, local, editable circle image.
      <Image
        type='circle'
        editable={true}
        folderPrefix='donor'
      />
    </Box>
  );
};

export default ImageComponentExample;
