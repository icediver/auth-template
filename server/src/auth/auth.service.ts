import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);
		console.log(user);
		return {
			user: this.returnUserFields(user),
			accessToken: 'secret token'
		};
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userRepository.findOne({
			where: { email: dto.email }
		});

		if (oldUser)
			throw new BadRequestException(
				'User with this email is already in the system'
			);

		const newUser = await this.userRepository.create({
			email: dto.email,
			password: dto.password,
			name: dto.email,
			avatarPath: '/uploads/avatars/batman.jpg'
		});
		const user = await this.userRepository.save(newUser);

		return {
			user: this.returnUserFields(user),
			accessToken: 'secret token'
		};
	}

	async validateUser(dto: AuthDto) {
		const user = await this.userRepository.findOne({
			where: {
				email: dto.email
			},
			select: ['id', 'email', 'password', 'avatarPath', 'name']
		});

		if (!user) throw new NotFoundException('Пользователь не найден!');
		const isValidPassword = (await dto.password) === user.password;

		if (!isValidPassword)
			throw new UnauthorizedException('Не правильный пароль!');

		return user;
	}

	returnUserFields(user: UserEntity) {
		return {
			id: user.id,
			email: user.email,
			avatarPath: user.avatarPath,
			name: user.name
		};
	}
}
