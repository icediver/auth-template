import Header from '@/ui/layout/header/Header';
import Meta from '@/utils/meta/Meta';
import { FC, PropsWithChildren } from 'react';

// import { useAuth } from '@/hooks/useAuth';
//
// import Meta from '@/utils/meta/Meta';
// import { IMeta } from '@/utils/meta/meta.interface';
import styles from './Layout.module.scss';

const Layout: FC<PropsWithChildren<any>> = ({ children, ...meta }) => {
	return (
		<>
			<Meta {...meta} />
			<section className={styles.wrapper}>
				<Header />
				<div className={styles.content}>
					<main className={styles.main}>{children}</main>
				</div>
			</section>
		</>
	);
};

export default Layout;
