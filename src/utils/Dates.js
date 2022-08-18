import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/ru';

dayjs.locale('ru');
dayjs.extend(relativeTime);
dayjs.extend(isBetween);

export default dayjs;
