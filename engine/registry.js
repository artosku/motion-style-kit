import { STY } from './styles.js';
import { STY2 } from './styles2.js';
import { STY3 } from './styles3.js';
import { STY4 } from './styles4.js';
export const ALL = [...STY, ...STY2, ...STY3, ...STY4];
ALL.forEach(S => { if (!S.draw && !S.full && S.paint) S.draw = (g, parts, ox, oy, sc, t) => paintPublic(g, parts, ox, oy, sc, S.paint, t); });
import { paint as paintPublic } from './styles.js';
