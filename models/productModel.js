import { supabase } from '../config/supabase.js'

// 🔥 Since Supabase id column is int8 (bigint)
const normalizeId = (id) => Number(id)


// Get all products
export const getAllProductsDB = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

// Get single product
export const getProductByIdDB = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', normalizeId(id))
    .maybeSingle()

  return { data, error }
}

// Create product
export const createProductDB = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()

  return { data, error }
}


// Update product
export const updateProductDB = async (id, updateData) => {
  const { data, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", normalizeId(id))
    .select()
    .maybeSingle();

  return { data, error };
};

// Delete product
export const deleteProductDB = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', normalizeId(id))   // 🔥 important

  return { error }
}

// Add review
export const addReviewDB = async (productId, review) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          product_id: normalizeId(productId),
          user: review.user,
          rating: review.rating,
          comment: review.comment,
        },
      ])
      .select();

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};