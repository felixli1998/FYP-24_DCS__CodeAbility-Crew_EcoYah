import React from 'react';
import Image from '../../components/Image/Image';
import { Box } from '@mui/material';

const ImageComponentExample: React.FC = () => {
  return (
    <Box m={2}>
      <h1>Image Component Example</h1>
      Standard, local, not editable square image.
      <Image
        imageId='1.png'
        imageSource='local'
        type='circle'
        width='125px'
        height='125px'
      />
      Standard, local, editable square image.
      <Image
        imageId='1.png'
        imageSource='local'
        type='rectangle'
        editable={true}
      />
      Standard, local, editable circle image.
      <Image
        imageId='1.png'
        imageSource='local'
        type='circle'
        editable={true}
      />
    </Box>
  );
};

export default ImageComponentExample;
