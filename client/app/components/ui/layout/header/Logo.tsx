import Link from 'next/link';
import { FC } from 'react';

import styles from './Header.module.scss';
import LogoIpsum from './logoipsum-220.svg';

const Logo: FC = () => {
	return (
		<Link href='/'>
			<a className={styles.logo}>
				<LogoIpsum />
			</a>
		</Link>
	);
};

export default Logo;
