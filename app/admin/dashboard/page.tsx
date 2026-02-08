"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import { Edit, Trash2, Mic, ShoppingBag, Plus, X } from "lucide-react";
import FileUploader from "@/components/admin/FileUploader";

const tabs = ["Settings", "Hero", "Book", "News", "Testimonials", "Audio", "Footer", "Contact"];

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Settings");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // simple auth check
        if (typeof window !== "undefined" && !document.cookie.includes("admin_auth=true")) {
            router.push("/admin");
        }
    }, [router]);

    const { data, mutate, error } = useSWR("/api/content", (url) =>
        fetch(url).then((res) => res.json())
    );

    const handleSave = async (section: string, newData: any) => {
        setLoading(true);
        setMessage("");

        const updatedData = { ...data, [section]: newData };

        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (res.ok) {
                setMessage(`${section} saved successfully!`);
                mutate(updatedData);
            } else {
                setMessage("Error saving data");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error saving data");
        } finally {
            setLoading(false);
        }
    };

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-sm text-gray-500">Manage Website</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab
                                ? "bg-amber-50 text-amber-600"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button onClick={() => { document.cookie = "admin_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; router.push("/admin"); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">{activeTab}</h2>
                        {message && <span className="text-green-600 text-sm font-medium animate-pulse">{message}</span>}
                    </div>

                    <div className="space-y-6">
                        {activeTab === "Settings" && <SettingsForm data={data.branding} onSave={(d) => handleSave("branding", d)} loading={loading} />}
                        {activeTab === "Hero" && <HeroForm data={data.hero} onSave={(d) => handleSave("hero", d)} loading={loading} />}
                        {activeTab === "Book" && <BookForm data={data.book} onSave={(d) => handleSave("book", d)} loading={loading} />}
                        {activeTab === "News" && <NewsManager articles={data.newsArticles || []} onSave={(articles) => handleSave("newsArticles", articles)} loading={loading} />}
                        {activeTab === "Testimonials" && <TestimonialsManager testimonials={data.testimonials || []} onSave={(t) => handleSave("testimonials", t)} loading={loading} />}
                        {activeTab === "Audio" && <AudioManager tracks={data.audioStories || []} onSave={(t) => handleSave("audioStories", t)} loading={loading} />}
                        {activeTab === "Footer" && <FooterForm data={data.footer} onSave={(d) => handleSave("footer", d)} loading={loading} />}
                        {activeTab === "Contact" && <ContactForm data={data.contact} onSave={(d) => handleSave("contact", d)} loading={loading} />}
                    </div>
                </div>
            </main>
        </div>
    );
}

function SettingsForm({ data, onSave, loading }: { data: any, onSave: (d: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState(data || { logoText: "", logoUrl: "" });

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <label className="block text-sm font-medium text-gray-700">Logo Text</label>
                <input
                    type="text"
                    value={formData.logoText}
                    onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
            </div>

            <FileUploader label="Logo Image (Optional)" value={formData.logoUrl} onChange={(url) => setFormData({ ...formData, logoUrl: url })} />

            <button
                onClick={() => onSave(formData)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Settings"}
            </button>
        </div>
    );
}

function HeroForm({ data, onSave, loading }: { data: any, onSave: (d: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState(data || { title: "", description_en: "", description_tr: "", imageUrl: "" });

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <label className="block text-sm font-medium text-gray-700">Hero Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">English Description</label>
                    <textarea
                        rows={4}
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Turkish Description</label>
                    <textarea
                        rows={4}
                        value={formData.description_tr}
                        onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Extended Bio (Learn More)</label>
                <textarea
                    rows={6}
                    value={formData.extended_bio}
                    onChange={(e) => setFormData({ ...formData, extended_bio: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
            </div>

            <FileUploader label="Hero Image" value={formData.imageUrl} onChange={(url) => setFormData({ ...formData, imageUrl: url })} />

            <button
                onClick={() => onSave(formData)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Hero"}
            </button>
        </div>
    );
}

function BookForm({ data, onSave, loading }: { data: any, onSave: (d: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState(data || { title: "", author: "", salesBadge: "", purchaseLink: "", coverUrl: "", stores: [] });

    // Ensure stores array exists
    const stores = formData.stores || [];

    const handleAddStore = () => {
        setFormData({ ...formData, stores: [...stores, { name: "", url: "" }] });
    };

    const handleRemoveStore = (index: number) => {
        const newStores = stores.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, stores: newStores });
    };

    const handleStoreChange = (index: number, field: string, value: string) => {
        const newStores = stores.map((store: any, i: number) => i === index ? { ...store, [field]: value } : store);
        setFormData({ ...formData, stores: newStores });
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Book Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Author Name</label>
                    <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Link (Main Button)</label>
                <input
                    type="text"
                    value={formData.purchaseLink}
                    onChange={(e) => setFormData({ ...formData, purchaseLink: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
            </div>

            <FileUploader label="Book Cover" value={formData.coverUrl} onChange={(url) => setFormData({ ...formData, coverUrl: url })} />

            {/* Store Links Section */}
            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Store Links</h3>
                    <button type="button" onClick={handleAddStore} className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700">
                        <Plus size={16} /> Add Store
                    </button>
                </div>
                <div className="space-y-3">
                    {stores.map((store: any, index: number) => (
                        <div key={index} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
                            <input
                                placeholder="Store Name (e.g. Amazon)"
                                value={store.name}
                                onChange={(e) => handleStoreChange(index, "name", e.target.value)}
                                className="flex-1 border p-2 rounded text-sm"
                            />
                            <input
                                placeholder="Link URL"
                                value={store.url}
                                onChange={(e) => handleStoreChange(index, "url", e.target.value)}
                                className="flex-1 border p-2 rounded text-sm"
                            />
                            <button type="button" onClick={() => handleRemoveStore(index)} className="text-red-500 hover:text-red-700">
                                <X size={18} />
                            </button>
                        </div>
                    ))}
                    {stores.length === 0 && <p className="text-sm text-gray-500 italic">No additional stores added.</p>}
                </div>
            </div>


            <button
                onClick={() => onSave(formData)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Book Details"}
            </button>
        </div>
    );
}

function NewsManager({ articles, onSave, loading }: { articles: any[], onSave: (d: any) => void, loading: boolean }) {
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [formData, setFormData] = useState({ title: "", slug: "", excerpt: "", imageUrl: "", content: "" });

    const handleEdit = (article: any) => {
        setEditingId(article.id);
        setFormData(article);
    };

    const handleCreate = () => {
        setEditingId("new");
        setFormData({ title: "", slug: "", excerpt: "", imageUrl: "", content: "" });
    };

    const handleDelete = (id: any) => {
        if (confirm("Are you sure?")) {
            const updated = articles.filter((a: any) => a.id !== id);
            onSave(updated);
        }
    };

    const handleFormSave = () => {
        let updatedArticles;
        if (editingId === "new") {
            const newArticle = { ...formData, id: Date.now() };
            updatedArticles = [...articles, newArticle];
        } else {
            updatedArticles = articles.map((a: any) => a.id === editingId ? { ...formData, id: editingId } : a);
        }
        onSave(updatedArticles);
        setEditingId(null);
    };

    if (editingId) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-lg font-medium">{editingId === "new" ? "Create Article" : "Edit Article"}</h3>
                <input placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2 rounded" />
                <input placeholder="Slug (e.g. my-article)" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full border p-2 rounded" />
                <textarea placeholder="Excerpt" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className="w-full border p-2 rounded" rows={2} />
                <FileUploader label="Featured Image" value={formData.imageUrl} onChange={url => setFormData({ ...formData, imageUrl: url })} />
                <textarea placeholder="HTML Content (use <p> tags)" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full border p-2 rounded font-mono text-xs" rows={10} />

                <div className="flex gap-2">
                    <button onClick={handleFormSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Articles</h3>
                <button onClick={handleCreate} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium">Add New Article</button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {articles.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No articles yet.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {articles.map((article: any) => (
                            <li key={article.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    {article.imageUrl && <div className="w-12 h-12 relative rounded overflow-hidden bg-gray-100"><Image src={article.imageUrl} alt="" fill className="object-cover" /></div>}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{article.title}</h4>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{article.slug}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(article)} className="p-2 text-gray-400 hover:text-amber-600"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(article.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function TestimonialsManager({ testimonials, onSave, loading }: { testimonials: any[], onSave: (d: any) => void, loading: boolean }) {
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [formData, setFormData] = useState({ text: "", author: "", role: "", rating: 5 });

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData(item);
    };

    const handleCreate = () => {
        setEditingId("new");
        setFormData({ text: "", author: "", role: "", rating: 5 });
    };

    const handleDelete = (id: any) => {
        if (confirm("Are you sure?")) {
            const updated = testimonials.filter((t: any) => t.id !== id);
            onSave(updated);
        }
    };

    const handleFormSave = () => {
        let updatedItems;
        if (editingId === "new") {
            const newItem = { ...formData, id: Date.now() };
            updatedItems = [...testimonials, newItem];
        } else {
            updatedItems = testimonials.map((t: any) => t.id === editingId ? { ...formData, id: editingId } : t);
        }
        onSave(updatedItems);
        setEditingId(null);
    };

    if (editingId) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-lg font-medium">{editingId === "new" ? "Add Testimonial" : "Edit Testimonial"}</h3>
                <textarea placeholder="Quote text" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} className="w-full border p-2 rounded" rows={3} />
                <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Author Name" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full border p-2 rounded" />
                    <input placeholder="Role / Title" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                    <label className="text-sm text-gray-600">Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} className="w-full border p-2 rounded" />
                </div>

                <div className="flex gap-2">
                    <button onClick={handleFormSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Testimonials</h3>
                <button onClick={handleCreate} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium">Add New Testimonial</button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {testimonials.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No testimonials yet.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {testimonials.map((item: any) => (
                            <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">{item.author}</h4>
                                    <p className="text-xs text-gray-500 italic max-w-lg truncate">"{item.text}"</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-amber-600"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function AudioManager({ tracks, onSave, loading }: { tracks: any[], onSave: (d: any) => void, loading: boolean }) {
    const [editingId, setEditingId] = useState<number | string | null>(null);
    const [formData, setFormData] = useState({ title: "", description: "", imageUrl: "", audioUrl: "", duration: "" });

    const handleEdit = (track: any) => {
        setEditingId(track.id);
        setFormData(track);
    };

    const handleCreate = () => {
        setEditingId("new");
        setFormData({ title: "", description: "", imageUrl: "", audioUrl: "", duration: "" });
    };

    const handleDelete = (id: any) => {
        if (confirm("Are you sure?")) {
            const updated = tracks.filter((t: any) => t.id !== id);
            onSave(updated);
        }
    };

    const handleFormSave = () => {
        let updatedTracks;
        if (editingId === "new") {
            const newTrack = { ...formData, id: Date.now() };
            updatedTracks = [...tracks, newTrack];
        } else {
            updatedTracks = tracks.map((t: any) => t.id === editingId ? { ...formData, id: editingId } : t);
        }
        onSave(updatedTracks);
        setEditingId(null);
    };

    if (editingId) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-lg font-medium">{editingId === "new" ? "Add Audio Track" : "Edit Audio Track"}</h3>
                <input placeholder="Track Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2 rounded" />
                <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" rows={2} />
                <input placeholder="Duration (e.g. 4:20)" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full border p-2 rounded" />

                <FileUploader label="Cover Image" value={formData.imageUrl} onChange={url => setFormData({ ...formData, imageUrl: url })} accept="image/*" />
                <FileUploader label="Audio File" value={formData.audioUrl} onChange={url => setFormData({ ...formData, audioUrl: url })} accept="audio/*" />

                <div className="flex gap-2">
                    <button onClick={handleFormSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Audio Tracks</h3>
                <button onClick={handleCreate} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium">Add New Track</button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {tracks.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No tracks yet.</div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {tracks.map((track: any) => (
                            <li key={track.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center bg-gray-100 rounded-full p-2">
                                        <Mic className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{track.title}</h4>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{track.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(track)} className="p-2 text-gray-400 hover:text-amber-600"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(track.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function FooterForm({ data, onSave, loading }: { data: any, onSave: (d: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState(data || { logoText: "", logoUrl: "", buttonText: "", buttonUrl: "" });

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <label className="block text-sm font-medium text-gray-700">Logo Text (Fallback)</label>
                <input
                    type="text"
                    value={formData.logoText}
                    onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
            </div>

            <FileUploader label="Footer Logo Image" value={formData.logoUrl} onChange={(url) => setFormData({ ...formData, logoUrl: url })} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Button Text</label>
                    <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Button URL</label>
                    <input
                        type="text"
                        value={formData.buttonUrl}
                        onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                    />
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Footer Settings"}
            </button>
        </div>
    );
}

function ContactForm({ data, onSave, loading }: { data: any, onSave: (d: any) => void, loading: boolean }) {
    const [formData, setFormData] = useState(data || { email: "", socials: { instagram: "", twitter: "", linkedin: "", youtube: "", medium: "" } });

    // Helper to update nested social fields
    const handleSocialChange = (key: string, value: string) => {
        setFormData({
            ...formData,
            socials: {
                ...formData.socials,
                [key]: value
            }
        });
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                />
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                        <input
                            type="text"
                            placeholder="https://instagram.com/..."
                            value={formData.socials?.instagram || ""}
                            onChange={(e) => handleSocialChange("instagram", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Twitter (X) URL</label>
                        <input
                            type="text"
                            placeholder="https://x.com/..."
                            value={formData.socials?.twitter || ""}
                            onChange={(e) => handleSocialChange("twitter", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                        <input
                            type="text"
                            placeholder="https://linkedin.com/in/..."
                            value={formData.socials?.linkedin || ""}
                            onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
                        <input
                            type="text"
                            placeholder="https://youtube.com/..."
                            value={formData.socials?.youtube || ""}
                            onChange={(e) => handleSocialChange("youtube", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Medium URL</label>
                        <input
                            type="text"
                            placeholder="https://medium.com/..."
                            value={formData.socials?.medium || ""}
                            onChange={(e) => handleSocialChange("medium", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Contact Info"}
            </button>
        </div>
    );
}
