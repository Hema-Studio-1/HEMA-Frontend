import { ChevronRight, Eye, Heart, Info, Plus, Trash2, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { AssetDetailView } from './AssetDetailView';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ImportAssetDrawer } from './ImportAssetDrawer';

interface Asset {
  id: string;
  name: string;
  category: string;
  type: 'Furniture' | 'Lighting' | 'Kitchen' | 'Decor' | 'Accessories';
  imageUrl: string;
  isLiked: boolean;
  description?: string;
}

const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Modern Accent Chair',
    category: 'Seating',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1769255119622-1bd8e49ff35c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2NlbnQlMjBjaGFpciUyMG1vZGVybiUyMG5ldXRyYWwlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MDU5OTIwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Contemporary accent chair with clean lines and neutral upholstery'
  },
  {
    id: '2',
    name: 'Scandinavian Lounge Chair',
    category: 'Seating',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1624345691006-e683ff409f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3VuZ2UlMjBjaGFpciUyMHNjYW5kaW5hdmlhbiUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzA1OTkyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: true,
    description: 'Mid-century inspired lounge chair with wooden frame'
  },
  {
    id: '3',
    name: 'Minimal Dining Chair',
    category: 'Seating',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1765371513017-c5387f9f9d74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjBjaGFpciUyMHdvb2QlMjBtaW5pbWFsfGVufDF8fHx8MTc3MDU5OTIwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Solid wood dining chair with ergonomic design'
  },
  {
    id: '4',
    name: 'Contemporary Sofa',
    category: 'Seating',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1759722667832-48e555120458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2ZhJTIwbmV1dHJhbCUyMHByb2R1Y3R8ZW58MXx8fHwxNzcwNTk5MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Three-seat sofa with neutral fabric and low profile'
  },
  {
    id: '5',
    name: 'Modular Sectional',
    category: 'Seating',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1698936061086-2bf99c7b9fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN0aW9uYWwlMjBzb2ZhJTIwYmVpZ2UlMjBtaW5pbWFsfGVufDF8fHx8MTc3MDU5OTIwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: true,
    description: 'Beige sectional sofa with modular configuration'
  },
  {
    id: '6',
    name: 'Wood Coffee Table',
    category: 'Tables',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1770282184805-52b3b5a3b022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjB0YWJsZSUyMHdvb2QlMjBwcm9kdWN0fGVufDF8fHx8MTc3MDU5OTIwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Solid wood coffee table with natural finish'
  },
  {
    id: '7',
    name: 'Marble Side Table',
    category: 'Tables',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1643558544531-bff73bbffc28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWRlJTIwdGFibGUlMjBtYXJibGUlMjBicmFzc3xlbnwxfHx8fDE3NzA1OTkyMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Marble side table with brass metal base'
  },
  {
    id: '8',
    name: 'Oak Dining Table',
    category: 'Tables',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1754586397159-f40280a7fc54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5pbmclMjB0YWJsZSUyMG9hayUyMG1pbmltYWx8ZW58MXx8fHwxNzcwNTk5MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Large oak dining table with minimalist design'
  },
  {
    id: '9',
    name: 'Arc Floor Lamp',
    category: 'Floor',
    type: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1763060722627-e06bfa20faaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vciUyMGxhbXAlMjBhcmMlMjBtb2Rlcm58ZW58MXx8fHwxNzcwNTk5MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: true,
    description: 'Modern arc floor lamp with adjustable height'
  },
  {
    id: '10',
    name: 'Brass Table Lamp',
    category: 'Table',
    type: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1655151410073-26aebe257133?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMGxhbXAlMjBicmFzcyUyMGNvbnRlbXBvcmFyeXxlbnwxfHx8fDE3NzA1OTkyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Contemporary table lamp with brass finish'
  },
  {
    id: '11',
    name: 'Pendant Light',
    category: 'Ceiling',
    type: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1543769527-0d7a67ac0872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50JTIwbGlnaHQlMjBtaW5pbWFsJTIwY2VpbGluZ3xlbnwxfHx8fDE3NzA1OTkyMDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Minimal pendant light with glass shade'
  },
  {
    id: '12',
    name: 'Modern Chandelier',
    category: 'Ceiling',
    type: 'Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1765282947675-2dd83fb46ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFuZGVsaWVyJTIwbW9kZXJuJTIwYnJhc3N8ZW58MXx8fHwxNzcwNTk5MjA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Brass chandelier with modern geometric design'
  },
  {
    id: '13',
    name: 'Ceramic Vase',
    category: 'Decorative Objects',
    type: 'Decor',
    imageUrl: 'https://images.unsplash.com/photo-1660958639203-cbc9bb56955b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwdmFzZSUyMHdoaXRlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzA1OTkyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: true,
    description: 'White ceramic vase with organic shape'
  },
  {
    id: '14',
    name: 'Wooden Stool',
    category: 'Seating',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1618210521361-994c6ae74141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9vbCUyMHdvb2QlMjBzY3VscHR1cmFsfGVufDF8fHx8MTc3MDU5OTIwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Sculptural wooden stool with natural grain'
  },
  {
    id: '15',
    name: 'Decorative Bowl',
    category: 'Decorative Objects',
    type: 'Decor',
    imageUrl: 'https://images.unsplash.com/photo-1644052023360-256fb9d2767c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWNvcmF0aXZlJTIwYm93bCUyMGNlcmFtaWMlMjBuZXV0cmFsfGVufDF8fHx8MTc3MDU5OTIwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Ceramic bowl with textured neutral finish'
  },
  {
    id: '16',
    name: 'Velvet Ottoman',
    category: 'Seating',
    type: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1770291691618-c42becb6f750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdHRvbWFuJTIwdmVsdmV0JTIwbW9kZXJufGVufDF8fHx8MTc3MDU5OTIwNnww&ixlib=rb-4.1.0&q=80&w=1080',
    isLiked: false,
    description: 'Upholstered ottoman with velvet fabric'
  },
];

const categories = [
  'Seating',
  'Tables',
  'Ceiling',
  'Floor',
  'Table',
  'Decorative Objects',
];

const types = ['Furniture', 'Lighting', 'Kitchen', 'Decor', 'Accessories'];

export function Assets() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isImportDrawerOpen, setIsImportDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  const handleToggleLike = (id: string) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, isLiked: !asset.isLiked } : asset
    ));
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
    }
  };

  const handleImportAsset = (name: string, type: 'Furniture' | 'Lighting' | 'Kitchen' | 'Decor' | 'Accessories', category: string, imageUrl: string) => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      name,
      category,
      type,
      imageUrl,
      isLiked: false,
      description: ''
    };
    setAssets([newAsset, ...assets]);
    setIsImportDrawerOpen(false);
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = !selectedCategory || asset.category === selectedCategory;
    const matchesType = !selectedType || asset.type === selectedType;
    return matchesCategory && matchesType;
  });

  return (
    <>
      <div className="">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 
              className="text-3xl lg:text-4xl tracking-tight text-[#2a2a2a] mb-2"
            >
              Assets
            </h2>
            <p 
              className="text-sm text-[#9a9a9a]"
            >
              Curated interior elements for architectural spaces
            </p>
          </div>

          {/* Action Cluster - Right Aligned */}
          <div className="flex items-center gap-3">
            {/* Filter - Secondary Action */}
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="flex items-center gap-2 text-[13px] text-[#626262] hover:text-[#2a2a2a] transition-colors duration-300"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              Filter
              <ChevronRight 
                size={14} 
                strokeWidth={1.5}
                className={`transition-transform duration-300 ${
                  isFiltersExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Import Asset - Primary Action */}
            <button 
              onClick={() => setIsImportDrawerOpen(true)}
              className="px-4 py-3 bg-[#2a2a2a] text-[#FDFCFB] text-[13px] rounded-sm hover:opacity-80 transition-opacity duration-300"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
            >
              Import asset
            </button>
          </div>
        </div>

        {/* Asset Grid */}
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3, 1400: 4 }}
          gutterBreakPoints={{ 0: '15px' }}
          >
            <Masonry>
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="relative cursor-pointer group"
                  onMouseEnter={() => setHoveredId(asset.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Asset Image */}
                  <div 
                    className="overflow-hidden rounded-sm bg-[#FDFCFB] border border-[#E8E6E3]"
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      className="w-full h-auto block transition-opacity duration-500"
                      style={{
                        opacity: hoveredId === asset.id ? 0.85 : 1
                      }}
                    />
                  </div>
                  
                  {/* Asset Info - Always visible */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div>
                      <p
                        className="text-base text-[#2a2a2a] flex-1 !font-normal"
                      >
                        {asset.name}
                      </p>
                    {/* Type Tag */}
                    <span
                      className="inline-block text-sm bg-[#F7F5F2] text-[#626262] rounded-sm uppercase"
                    >
                      {asset.type}
                    </span>
                      </div>
                      {asset.isLiked && (
                        <Heart className="text-[#2a2a2a] fill-current ml-2 flex-shrink-0 size-4" strokeWidth={0} />
                      )}
                    </div>
                    
                 
                  </div>

                  {/* Actions on hover */}
                  <div
                    className="absolute top-3 right-3 flex gap-2 transition-opacity duration-300"
                    style={{
                      opacity: hoveredId === asset.id ? 1 : 0
                    }}
                  >
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                      title="View"
                    >
                      <Eye size={14} className="text-[#626262]" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                      title="Info"
                    >
                      <Info size={14} className="text-[#626262]" strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(asset.id);
                      }}
                      className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                      title={asset.isLiked ? "Unlike" : "Like"}
                    >
                      <Heart 
                        size={14} 
                        className={`transition-colors duration-300 ${
                          asset.isLiked 
                            ? 'text-[#2a2a2a] fill-current' 
                            : 'text-[#626262]'
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssetToDelete(asset);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-[#626262]" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>

        {/* Backdrop */}
        {isFiltersExpanded && (
          <div 
            className="fixed inset-0 bg-[#2a2a2a]/5 backdrop-blur-sm z-30 transition-opacity duration-500"
            onClick={() => setIsFiltersExpanded(false)}
          />
        )}

        {/* Filter Panel */}
        <aside 
          className={`fixed right-0 top-0 bottom-0 w-72 bg-[#FDFCFB] px-12 py-12 overflow-y-auto transition-transform duration-500 ease-out z-50 ${
            isFiltersExpanded ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Type Filter */}
          <div className="mb-10">
            <h4 
              className="text-[11px] uppercase tracking-widest text-[#9a9a9a] mb-4"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: '0.15em'
              }}
            >
              Type
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedType('')}
                className={`block text-left text-[14px] transition-colors duration-300 ${
                  selectedType === ''
                    ? 'text-[#2a2a2a]'
                    : 'text-[#c5c5c5] hover:text-[#626262]'
                }`}
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: selectedType === '' ? 400 : 300
                }}
              >
                All
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? '' : type)}
                  className={`block text-left text-[14px] transition-colors duration-300 ${
                    selectedType === type
                      ? 'text-[#2a2a2a]'
                      : 'text-[#c5c5c5] hover:text-[#626262]'
                  }`}
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: selectedType === type ? 400 : 300
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-10">
            <h4 
              className="text-[11px] uppercase tracking-widest text-[#9a9a9a] mb-4"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: '0.15em'
              }}
            >
              Category
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`block text-left text-[14px] transition-colors duration-300 ${
                  selectedCategory === ''
                    ? 'text-[#2a2a2a]'
                    : 'text-[#c5c5c5] hover:text-[#626262]'
                }`}
                style={{ 
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: selectedCategory === '' ? 400 : 300
                }}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                  className={`block text-left text-[14px] transition-colors duration-300 ${
                    selectedCategory === category
                      ? 'text-[#2a2a2a]'
                      : 'text-[#c5c5c5] hover:text-[#626262]'
                  }`}
                  style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: selectedCategory === category ? 400 : 300
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {(selectedCategory || selectedType) && (
            <button 
              className="text-[12px] text-[#9a9a9a] hover:text-[#2a2a2a] transition-colors duration-300 mt-12"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: '0.05em'
              }}
              onClick={() => {
                setSelectedCategory('');
                setSelectedType('');
              }}
            >
              Reset
            </button>
          )}
        </aside>
      </div>

      {/* Asset Detail View */}
      {selectedAsset && (
        <AssetDetailView
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onToggleLike={handleToggleLike}
          onDelete={handleDeleteAsset}
        />
      )}

      {/* Import Asset Drawer */}
      {isImportDrawerOpen && (
        <ImportAssetDrawer
          onClose={() => setIsImportDrawerOpen(false)}
          onImport={handleImportAsset}
        />
      )}

      {/* Delete Confirm Dialog */}
      {isDeleteDialogOpen && assetToDelete && (
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => handleDeleteAsset(assetToDelete.id)}
        />
      )}
    </>
  );
}