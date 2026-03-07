export async function createSlip(data: any) {
  try {
    const res = await fetch("http://localhost:5001/api/purchase-slips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Create Slip API Error:", errorText);
      throw new Error("Failed to create slip");
    }

    return await res.json();
  } catch (error) {
    console.error("createSlip request failed:", error);
    throw error;
  }
}

export async function getPurchaseSlips(params: {
  page: number;
  limit: number;
  sortBy?: string;
  order?: string;
  farmer?: string;
  item?: string;
}) {
  const query = new URLSearchParams();

  query.append("page", String(params.page));
  query.append("limit", String(params.limit));

  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.order) query.append("order", params.order);
  if (params.farmer) query.append("farmer", params.farmer);
  if (params.item) query.append("item", params.item);

  const res = await fetch(
    `http://localhost:5001/api/purchase-slips?${query.toString()}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch slips");
  }

  return res.json();
}

export async function updatePurchaseSlip(
  id: number,
  data: Record<string, any>,
) {
  try {
    const res = await fetch(`http://localhost:5001/api/purchase-slips/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Update slip failed:", error);
      throw new Error("Failed to update slip");
    }

    return res.json();
  } catch (error) {
    console.error("Update slip request error:", error);
    throw error;
  }
}
