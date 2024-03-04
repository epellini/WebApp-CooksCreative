/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Card, { CardProps } from '@mui/joy/Card';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';

import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';

export default function DropZone(props: CardProps & { onFilesAdded: (files: FileList) => void, icon?: React.ReactElement }) {
  const { icon, onFilesAdded, sx, ...other } = props;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesAdded(files);
      
    }
  };

  // const handleFileInput = (event) => {
  //   // Pass the FileList directly
  //   onFilesAdded(event.target.files);
  // };

  const handleClick = (event) => {
    
    event.stopPropagation();
    
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.stopPropagation(); // Add this line
  const files = event.dataTransfer.files;
  if (files && files.length > 0) {
    onFilesAdded(files);
  }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card
      variant="soft"
      {...other}
      sx={[
        {
          borderRadius: 'sm',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
          px: 3,
          flexGrow: 1,
          boxShadow: 'none',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
      <AspectRatio
        ratio="1"
        variant="solid"
        color="primary"
        sx={{
          minWidth: 32,
          borderRadius: '50%',
          '--Icon-fontSize': '16px',
        }}
      >
        <div>{icon ?? <FileUploadRoundedIcon />}</div>
      </AspectRatio>
      <Typography level="body-sm" textAlign="center">

        {/* <Link component="button" overlay onClick={handleClick}>
          Click to upload
        </Link> */}
        <Button type="button" onClick={handleClick}>
          Click to upload
        </Button>
        {' '}
        or drag and drop
        <br /> SVG, PNG, JPG or GIF (max. 800x400px)
      </Typography>
    </Card>
  );

}