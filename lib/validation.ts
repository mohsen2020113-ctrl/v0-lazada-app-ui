import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  rememberMe: z.boolean().optional().default(false),
})

export const registerSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export const resetPasswordSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صحيح'),
})

export const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
})

export const profileSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  country: z.string().optional(),
  language: z.enum(['ar', 'en', 'th']).optional(),
})

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string(),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string(),
  country: z.string(),
  isDefault: z.boolean().optional(),
})

export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1),
  shippingAddress: addressSchema,
  paymentMethodId: z.string(),
  couponCode: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
