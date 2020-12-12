import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    imageContainer: {
        backgroundColor: theme.palette.grey[400],
        width: 36,
        height: 36,
        position: 'relative'
    },
    image: {
        position: 'absolute',
        top: 0,
        left: 0,
        objectFit: 'cover',
        objectPosition: 'center center',
        width: '100%',
        height: '100%'
    },
}))

const TableThumbnailImage: React.FC<{ src: string }> = ({ src }) => {
    const classes = useStyles();
    return <div className={classes.imageContainer}><img alt="Thumbnail" className={classes.image} src={src} /></div>
}

export default TableThumbnailImage;