/*** Horizontal and vertical table A (Horizontal), B (Vertical), C (vert), D (vert) */
function drawChart(valuesH, valuesV2d, clolrs2d = null)
{
  if(valuesV2d.length < 1 || valuesH.length != valuesV2d[0].length)
  {
    throw exception("Length of values x must be equal to length of values y");
  }
  
  const canvas = document.getElementById("bio");
  const ctx = canvas.getContext("2d");
  
  let minY = 2147483646;
  let maxY = -2147483646;
  /*GET MIN and MAX*/
  for(let i = 0; i < valuesH.length; i++)
  {
    if(valuesH[i] < minY)
    {
      minY = valuesH[i];
    }
    if(valuesH[i] > maxY)
    {
      maxY = valuesH[i];
    }
  }

  let minX = 2147483646;
  let maxX = -2147483646;
  /*GET MIN and MAX*/
  for(var l = 0; l < valuesV2d.length; l++)
  {
    for(let i = 0; i < valuesV2d[l].length; i++)
    {
      if(valuesV2d[l][i] < minX)
      {
        minX = valuesV2d[l][i];
      }
      if(valuesV2d[l][i] > maxX)
      {
        maxX = valuesV2d[l][i];
      }
    }
  }
  
  let distY = maxY - minY;
  let distX = maxX - minX;
  let height = canvas.height;
  let width = canvas.width;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#000000";

  /*DRAW THE LINES BETWEEN THE POINTS*/
  const cs3 = ctx.strokeStyle;
  ctx.strokeStyle = "#000000";

  ctx.beginPath();
  ctx.moveTo(20, height);
  ctx.lineTo(20, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(1, height-20);
  ctx.lineTo(width, height-20);
  ctx.stroke();
  ctx.strokeStyle = cs3;

  
  for(var l = 0; l < valuesV2d.length; l++)
  {
    let lastX = -1.23456;
    let lastY = -1.23456;
    if(clolrs2d)
    {
      ctx.strokeStyle = clolrs2d[l];
    }
    else
    {
      ctx.strokeStyle = "#FF0000";
    }
    
    for(let i = 0; i < valuesH.length; i++)
    {
      const vh = valuesH[i];
      const vv = valuesV2d[l][i];
      const posX = (vh-minY)/(distY)*(width-20)+20;
      const posY = (height-10)-(vv-minX)/(distX)*(height-20)-10;

      const cs = ctx.strokeStyle;
      ctx.strokeStyle = "#000000";
      if(posY < height-20)
      {
        ctx.beginPath();
        ctx.moveTo(16, posY-1);
        ctx.lineTo(24, posY-1);
        ctx.stroke();
        ctx.save();
        ctx.translate(2, posY+3);
        if(posY - 5 < 0)
        {
          ctx.translate(2, posY+5);
          ctx.beginPath();
          ctx.moveTo(16, posY-5);
          ctx.lineTo(24, posY-5);
          ctx.stroke();
        }
        ctx.textAlign = "left";
        ctx.fillText((""+vv).substring(0, 6), 0, 0);
        ctx.restore();
      }
      ctx.strokeStyle = cs;

      if(lastX != -1.23456 || lastY != -1.23456)
      {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(posX, posY);
        ctx.stroke();
        ctx.font = "8px";
        if(posY < height)
        {
          const cs2 = ctx.strokeStyle;
          ctx.strokeStyle = "#000000";
          
          ctx.beginPath();
          if(posX+1 > width)
          {
            ctx.moveTo(posX-1, height-15);
            ctx.lineTo(posX-1, height-25);
          }
          else
          {
            ctx.moveTo(posX, height-15);
            ctx.lineTo(posX, height-25);
          }
          ctx.stroke();
          
          ctx.save();
          if(posX-9*l+23 > width)
          {
            ctx.translate(posX-9*l, height-10);
          }
          else
          {
            ctx.translate(posX-9*l, height-10);
          }
          ctx.rotate(-80 * Math.PI/180);
          ctx.textAlign = "center";
          if(posX> 20)
          {
            ctx.fillText((""+vh).substring(0, 10), 0, 0);
          }
          ctx.restore();
          ctx.strokeStyle = cs2;
        }
        
      }
      lastX = posX;
      lastY = posY;
    }
  }
}

/** HOW TO USE */
/* drawChart([1,2,3,7,8,9,10,15,16], [[0.1, 0.2, 0.3, 0.7, 0.4, 0.0, 0.0, 0.0, 0.0], [0.0, 0.0, 0.1, 0.2, 0.2, 0.5, 1.0, 0.3, 0.0]], ["#FF0000", "#0000FF"]); */

