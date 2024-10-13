import { InferSchemaType, model, Schema } from 'mongoose'

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
},
{
  timestamps: true
}
)

type User = InferSchemaType<typeof userSchema>

const UserModel = model<User>('User', userSchema)

export default UserModel
