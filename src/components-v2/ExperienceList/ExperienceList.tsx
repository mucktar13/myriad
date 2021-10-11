import React, {useState} from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import {ExperienceListProps, useStyles} from '.';
import {SimpleCard} from '../atoms/SimpleCard';

const ExperienceList: React.FC<ExperienceListProps> = ({
  experiences,
  isOnHomePage = false,
  user,
  filterTimeline,
}) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(false);

  //TODO: still unable to only select one experience card
  const handleClick = () => {
    setSelected(!selected);
  };

  return (
    <div className={classes.root}>
      {experiences.map(experience => (
        <div key={experience.id}>
          <SimpleCard
            filterTimeline={filterTimeline}
            user={user}
            onClick={handleClick}
            title={experience.name}
            creator={experience.user.name}
            imgUrl={experience.experienceImageURL || ''}
            isSelectable={isOnHomePage}
          />
        </div>
      ))}
      {!experiences.length && (
        <div className={classes.empty}>
          <Typography className={classes.title} component="p">
            Uh-oh!
          </Typography>
          <Typography className={classes.subtitle} color="textSecondary" component="p">
            It seems you don’t have an experience yet
          </Typography>
          <Link href={'/experience'}>
            <Button color="primary" variant="contained" size="small">
              Create Experience
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExperienceList;
