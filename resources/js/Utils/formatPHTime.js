const formatPHTime = (time24) => {
  if (!time24) return '';
  
  // Split hour, minute, second
  const [hour, minute, second] = time24.split(':');
  const h = parseInt(hour, 10);
  
  // Determine AM/PM
  const ampm = h >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  
  // Return formatted string with seconds
  return `${hour12}:${minute}:${second} ${ampm}`;
};

export default formatPHTime;