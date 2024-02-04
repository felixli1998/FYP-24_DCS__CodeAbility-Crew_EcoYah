export type DonationEvent = {
    id: number
    name: string
    image_id: string
    start_date: Date
    end_date: Date
    is_active: boolean
    created_at: Date
    updated_at: Date
    created_by_id: number
    event_type_id: number
}