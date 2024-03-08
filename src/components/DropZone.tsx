/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Card, { CardProps } from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';

export default function DropZone(props: CardProps & { onFilesAdded: (files: FileList) => void, icon?: React.ReactElement }) {
  const { icon, onFilesAdded, sx, ...other } = props;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFilesAdded(files);
      
    }
  };

  const handleClick = (event) => {
    
    event.stopPropagation();
    
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.stopPropagation();
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
      <Typography level="body-sm" textAlign="center">
        <Button type="button" onClick={handleClick}>
          Add Image
        </Button>
        {' '}
      </Typography>
    </Card>
  );

}