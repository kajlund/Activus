import { z } from 'zod';

export function generateErrrorObject(zodError) {
  const flattened = z.flattenError(zodError)?.fieldErrors;
  const error = {};
  for (const key in flattened) {
    error[key] = flattened[key]?.join(', ');
  }
  return error;
}

export function isoTimeToSec(timeStr) {
  const durationParts = timeStr.split(':').map((part) => parseInt(part, 10));
  return (
    (durationParts[0] || 0) * 3600 +
    (durationParts[1] || 0) * 60 +
    (durationParts[2] || 0)
  );
}

export function secToIsoTime(sec) {
  let sec_num = parseInt(sec, 10);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
}

export function secToHms(duration) {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = duration % 60;
  return {
    hrs,
    mins,
    secs,
  };
}

export function hmsToIsoTime(hrs, mins, secs) {
  return `${hrs.padStart(2, '0')}:${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`;
}
