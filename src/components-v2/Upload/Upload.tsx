import React, {useState} from 'react';

import {Button, LinearProgress} from '@material-ui/core';

import {Dropzone} from '../atoms/Dropzone';
import {useStyles} from './Upload.styles';

type UploadProps = {
  type: 'video' | 'image';
  accept: string[];
  loading: boolean;
  progress: number;
  maxSize?: number;
  placeholder?: string;
  multiple?: boolean;
  onFileSelected: (result: File[] | string) => void;
};

export const Upload: React.FC<UploadProps> = props => {
  const {
    accept,
    placeholder,
    maxSize,
    loading,
    type,
    multiple = false,
    progress,
    onFileSelected,
  } = props;
  const styles = useStyles();

  const [files, setFiles] = useState<File[]>([]);
  const handleFileSelected = (files: File[]) => {
    setFiles(files);
  };

  const handleConfirm = () => {
    onFileSelected(files);
  };

  return (
    <div className={styles.root}>
      <Dropzone
        type={type}
        multiple={multiple}
        loading={loading}
        onImageSelected={handleFileSelected}
        accept={accept}
        placeholder={placeholder}
        maxSize={maxSize}
      />

      <div className={styles.confirm}>
        <Button
          className={styles.button}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirm}
          disabled={files.length === 0 || loading}>
          {loading ? 'Uploading' : 'Confirm'}
        </Button>

        {loading && (
          <LinearProgress
            variant="determinate"
            color="primary"
            value={progress}
            className={styles.progress}
          />
        )}
      </div>
    </div>
  );
};
