import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ comment: '用户名' })
  username: string

  @Column({ comment: '年龄' })
  age: number
}
