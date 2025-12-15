import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        notFound()
    }

    return <ProductForm product={product} />
}
