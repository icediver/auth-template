import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
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
		const salt = await genSalt(10);
		const newUser = await this.userRepository.create({
			email: dto.email,
			password: await hash(dto.password, salt),
			name: dto.email,
			avatarPath: '/uploads/avatars/batman.jpg'
		});

		const user = await this.userRepository.save(newUser);

		return {
			user: this.returnUserFields(user),
			accessToken: 'secret token'
		};
	}

	async validateUser(dto: AuthDto): Promise<UserEntity> {
		const user = await this.userRepository.findOne({
			where: {
				email: dto.email
			},
			select: ['id', 'email', 'password', 'avatarPath', 'name']
		});

		if (!user) throw new NotFoundException('User not found!');
		const isValidPassword = await compare(dto.password, user.password);

		if (!isValidPassword) throw new UnauthorizedException('Invalid passport!');

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
