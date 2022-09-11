import LoginForm from '@/ui/layout/header/login-form/LoginForm';
import Logo from '@/ui/layout/header/Logo';
import Search from '@/ui/layout/header/search/Search';
import { FC } from 'react';

import styles from './Header.module.scss';

const Header: FC = () => {
	return (
		<header className={styles.header}>
			<Logo />
			<Search />
			<LoginForm />
		</header>
	);
};

export default Header;
