import * as React from 'react';
import clsx from 'clsx';
import { GridCellParams } from '@mui/x-data-grid-pro';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
interface Bon {
  id: number;
  dateCreation: string;
  typee: string;
  isSeenByRSR : boolean
  isSeenByDR : boolean
  isSeenByMag : boolean
}
const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: 26,
        borderRadius: 2,
      },
      value: {
        position: 'absolute',
        lineHeight: '24px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      },
      bar: {
        height: '100%',
        '&.low': {
          backgroundColor: '#f44336',
        },
        '&.medium': {
          backgroundColor: '#efbb5aa3',
        },
        '&.high': {
          backgroundColor: '#feff5c',
        },'&.complete': {
          backgroundColor: '#088208a3',
        },
      },
    }),
  { defaultTheme },
);

interface ProgressBarProps {
  value: number;
  label: string;
}

const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
  const { value, label } = props;
  const valueInPercent = value * 100;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.value}>{`${valueInPercent.toLocaleString()} % - ${label}`}</div>
      <div
        className={clsx(classes.bar, {
          low: valueInPercent < 30,
          medium: valueInPercent >= 30 && valueInPercent <= 60,
          high: valueInPercent > 60 && valueInPercent <= 80,
          complete: valueInPercent > 80,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </div>
  );
});

export function renderBCIProgress(params: GridCellParams ) {
  const { isSeenByRSR, isSeenByDR, isSeenByMag } = params.row as Bon;
  let progressValue = 0;
  let label = "";

  if (!isSeenByRSR && !isSeenByDR && !isSeenByMag) {
    progressValue = 20;
    label = "Processing by RSR";
  } else if (isSeenByRSR && !isSeenByDR && !isSeenByMag) {
    progressValue = 60;
    label = "Processing by Director";
  } else if (isSeenByRSR && isSeenByDR && !isSeenByMag) {
    progressValue = 80;
    label = "Processing by Magasinier";
  } else if (isSeenByRSR && isSeenByDR && isSeenByMag) {
    progressValue = 100;
    label = "Your Order is Ready";
  }

  return (
    <ProgressBar value={progressValue / 100} label={label} />
  );
}
