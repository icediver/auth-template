import Layout from '@/ui/layout/Layout';
import { FC } from 'react';
import styles from './Home.module.scss';

const Home: FC = () => {
	return (
		<Layout title='RED Cinema'>
			<h1 className={styles.heading}>content</h1>
		</Layout>
	);
};

export default Home;
