import struct
import json
import sys

def inspect_glb(filepath):
    print(f"=== Inspecting {filepath} ===")
    with open(filepath, 'rb') as f:
        # Read header
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a valid glTF file")
            return
        version, length = struct.unpack('<II', f.read(8))
        print(f"GLTF Version: {version}, Total Length: {length} bytes")
        
        # Read first chunk (JSON)
        chunk_length, chunk_type = struct.unpack('<II', f.read(8))
        if chunk_type != 0x4E4F534A: # JSON
            print("First chunk is not JSON")
            return
        
        json_data = f.read(chunk_length).decode('utf-8')
        gltf = json.loads(json_data)
        
        print("\n--- MATERIALS ---")
        materials = gltf.get('materials', [])
        for i, mat in enumerate(materials):
            print(f"Material [{i}]: {mat.get('name', 'unnamed')}")
            pbr = mat.get('pbrMetallicRoughness', {})
            base_color = pbr.get('baseColorFactor', [1.0, 1.0, 1.0, 1.0])
            emissive = mat.get('emissiveFactor', [0.0, 0.0, 0.0])
            roughness = pbr.get('roughnessFactor', 1.0)
            metalness = pbr.get('metallicFactor', 1.0)
            
            print(f"  Base Color Factor: {base_color}")
            print(f"  Emissive Factor:   {emissive}")
            print(f"  Roughness:         {roughness}")
            print(f"  Metalness:         {metalness}")
            
            # Check extensions (like KHR_materials_emissive_strength)
            exts = mat.get('extensions', {})
            if 'KHR_materials_emissive_strength' in exts:
                strength = exts['KHR_materials_emissive_strength'].get('emissiveStrength', 1.0)
                print(f"  Emissive Strength: {strength} (KHR extension)")
            
            # Print entire material JSON for completeness
            print(f"  Full JSON: {json.dumps(mat)}")
            print()

        print("--- SCENE NODES ---")
        nodes = gltf.get('nodes', [])
        for i, node in enumerate(nodes):
            name = node.get('name', 'unnamed')
            if 'mesh' in node or 'children' in node or 'translation' in node:
                print(f"Node [{i}]: name='{name}'")
                if 'mesh' in node:
                    print(f"  Mesh: {node['mesh']}")
                if 'translation' in node:
                    print(f"  Translation: {node['translation']}")
                if 'rotation' in node:
                    print(f"  Rotation: {node['rotation']}")
                if 'scale' in node:
                    print(f"  Scale: {node['scale']}")
                if 'children' in node:
                    print(f"  Children: {node['children']}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python inspect_glb.py <path_to_glb>")
    else:
        inspect_glb(sys.argv[1])
